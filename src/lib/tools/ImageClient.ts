import { DrizzleDB } from "$lib/Drizzle.ts";
import type { CommentReplySchema } from "$lib/schemas/CommentReply.ts";
import type { CommentSchema } from "$lib/schemas/Comments.ts";
import { images, type ImageSchema } from "$lib/schemas/Images.ts";
import type { PostSchema } from "$lib/schemas/Posts.ts";
import { bucketName, minioClient } from "$lib/server/MinIO.ts";
import { and, eq } from "drizzle-orm";
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';
import type { ImageWithBuffer } from "$lib/@types/IImage.ts";

type PostedObject = PostSchema | CommentSchema | CommentReplySchema;
type PostedObjectArray = PostSchema[] | CommentSchema[] | CommentReplySchema[];

class ImageClient {
    instance: ImageClient | null = null;

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
     * Retrieves images from S3 object storage and converts them to base64 data URLs.
     * 
     * First queries the database for image metadata using {@link getDrizzleImageObjects}, 
     * then fetches the actual image files from S3 storage and converts them to base64 
     * format for client consumption.
     * 
     * Uses {@link getDrizzleImageObjects} to query the {@link ImageSchema} table
     * Uses {@link ImageWithBuffer} for the return type structure
     * 
     * @param {PostedObject|PostedObjectArray} postedObject 
     *        Single object or array of posts, comments, or comment replies to fetch images for
     * @returns {Promise<ImageWithBuffer[]>} Promise resolving to image objects with base64 data URLs
     * 
     * @see minioClient.getObject - S3 object retrieval
     * @requires minio - For S3 object storage access
     */
    static async getS3Objects(postedObject: PostedObject | PostedObjectArray): Promise<ImageWithBuffer[]> {
        const drizzleImageObjects = this.getDrizzleImageObjects(postedObject);
        const imagePromises = (await drizzleImageObjects).map(async (imageObj: ImageSchema): Promise<ImageWithBuffer> => {
            const chunks: Buffer[] = [];

            const collectChunks = new Writable({
                write(chunk: Buffer, encoding, callback) {
                    chunks.push(chunk);
                    callback();
                }
            });

            const dataStream = await minioClient.getObject(bucketName, imageObj.bucketObjectId);

            await pipeline(dataStream, collectChunks);

            const bufferedImage = Buffer.concat(chunks)
            const base64 = bufferedImage.toString('base64');

            return {
                id: imageObj.id!,
                objectId: imageObj.objectId,
                objectType: imageObj.objectType,
                url: `data:image/*;base64,${base64}`,
                bucketObjectId: imageObj.bucketObjectId
            };
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

export default ImageClient;