import { DrizzleDB } from "$lib/Drizzle.ts";
import type { CommentReplySchema } from "$lib/schemas/CommentReply.ts";
import type { CommentSchema } from "$lib/schemas/Comments.ts";
import { images, type ImageSchema } from "$lib/schemas/Images.ts";
import type { PostSchema } from "$lib/schemas/Posts.ts";
import { bucketName, minioClient } from "$lib/server/MinIO.ts";
import { and, eq } from "drizzle-orm";
import type { ImageWithUrl } from "$lib/@types/IImage.ts";

type PostedObject = PostSchema | CommentSchema | CommentReplySchema;
type PostedObjectArray = PostSchema[] | CommentSchema[] | CommentReplySchema[];

class ImageService {
    instance: ImageService | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    /**
     * @description When images are uploaded to the object storage bucket the ID of that image is stored
     * within the Image table in drizzle along with the object id and type. (object id and type refers to the Post/Comment/CommentReply objects and their types).
     * This is used to create a connection between the user's created post and image.
     * 
     * Uses {@link DrizzleDB} to query the {@link ImageSchema} table
     * @param postedObject Single object or array of {@link PostSchema}, {@link CommentSchema}, or {@link CommentReplySchema}
     * @returns Image objects that exist within drizzle.
     */
    static async getDrizzleImageObjects(postedObject: PostedObject | PostedObjectArray): Promise<ImageSchema[]> {
        const objectArray = Array.isArray(postedObject) ? postedObject : [postedObject];

        const objects = []
        for (let i = 0; i < objectArray.length; i++) {
            const image = await DrizzleDB.query.images.findMany({
                where: (images, { eq }) => and(eq(images.objectId, objectArray[i].id!), eq(images.objectType, objectArray[i].type!)),
            })

            objects.push(...image)
        }

        return objects;
    };

    /**
     * Retrieves presigned URLs for images from S3 object storage.
     *
     * First queries the database for image metadata using {@link getDrizzleImageObjects},
     * then generates a time-limited presigned URL for each image file from S3 storage.
     * These URLs can be used directly in `<img>` tags on the client-side.
     *
     * Uses {@link getDrizzleImageObjects} to query the {@link ImageSchema} table.
     * Uses {@link ImageWithUrl} for the return type structure.
     *
     * @param {PostedObject|PostedObjectArray} postedObject
     * Single object or array of posts, comments, or comment replies to fetch images for
     * @param {number} expirySeconds The expiry time in seconds for the presigned URL (default: 3600 seconds = 1 hour).
     * @returns {Promise<ImageWithUrl[]>} Promise resolving to image objects with presigned URLs.
     *
     * @see minioClient.presignedGetObject - S3 presigned URL generation
     * @requires minio - For S3 object storage access
     */
    static async getS3Objects(postedObject: PostedObject | PostedObjectArray, expirySeconds: number = 3600): Promise<ImageWithUrl[]> {
        const drizzleImageObjects = await this.getDrizzleImageObjects(postedObject); // Await this call
        const imagePromises = drizzleImageObjects.map(async (imageObj: ImageSchema): Promise<ImageWithUrl> => {
            try {
                // Generate the presigned URL
                const url = await minioClient.presignedGetObject(bucketName, imageObj.bucketObjectId, expirySeconds);

                return {
                    id: imageObj.id!,
                    objectId: imageObj.objectId,
                    objectType: imageObj.objectType,
                    url: url, // This is the presigned URL
                    bucketObjectId: imageObj.bucketObjectId
                };
            } catch (error) {
                console.error(`Error generating presigned URL for ${imageObj.bucketObjectId}:`, error);
                // Optionally, handle error gracefully, e.g., return a placeholder URL or null
                return {
                    id: imageObj.id!,
                    objectId: imageObj.objectId,
                    objectType: imageObj.objectType,
                    url: '/path/to/placeholder-image.png', // Or some other default
                    bucketObjectId: imageObj.bucketObjectId
                };
            }
        });

        return Promise.all(imagePromises);
    }

    /**
     * Removes image records from the Drizzle ORM `images` table based on provided object details.
     * This function iterates through an array of objects and constructs a `DELETE` query
     * for each object to remove the corresponding entry from the database.
     *
     * @param objects An array of objects, where each object represents an image record to be deleted.
     * Each object must contain `userId`, `objectId`, `objectType`, and `bucketObjectId` properties.
     * The `id` property is also used if available for the `images.id` column.
     * @returns A `Promise` that resolves to `true` if all specified image records are successfully
     * removed from the Drizzle database.
     * @throws {Error} If the `objects` array is null or undefined, or if any database deletion operation fails.
     * Errors encountered during the database operation will be logged to the console.
     */
    static async removeDrizzleS3Objects(objects: {
        userId: string;
        objectId: string;
        objectType: string;
        bucketObjectId: string;
        id?: string | undefined;
    }[]): Promise<boolean> {
        try {
            if (!objects) {
                throw new Error("Failed to get objects for image removal. 'objects' array is null or undefined.");
            }
            for (let i = 0; i < objects.length; i++) {
                await DrizzleDB.delete(images)
                    .where(and(
                        eq(images.id, objects[i].id!),
                        eq(images.objectId, objects[i].objectId),
                        eq(images.objectType, objects[i].objectType),
                        eq(images.userId, objects[i].userId)
                    ));
            }

            return true;

        } catch (error) {
            console.error("Error in removeDrizzleS3Objects:", error);
            throw new Error(`Failed to remove Drizzle S3 objects: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        }
    }
}

export default ImageService;