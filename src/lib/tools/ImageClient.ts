import { DrizzleDB } from "$lib/Drizzle.ts";
import type { CommentReplySchema } from "$lib/schemas/CommentReply.ts";
import type { CommentSchema } from "$lib/schemas/Comments.ts";
import type { ImageSchema } from "$lib/schemas/Images.ts";
import type { PostSchema } from "$lib/schemas/Posts.ts";
import { bucketName, minioClient } from "$lib/server/MinIO.ts";
import { and } from "drizzle-orm";
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';
import type { ImageWithBuffer } from "$lib/@types/IImage.ts";



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
     * @param postedObject Array of {@link PostSchema}, {@link CommentSchema}, or {@link CommentReplySchema}
     * @returns Image objects that exist within drizzle.
     */
    static async getDrizzleImageObjects(postedObject: PostSchema[] | CommentSchema[] | CommentReplySchema[]): Promise<ImageSchema[]> {
        const objects = []
        for (let i = 0; i < postedObject.length; i++) {
            const image = await DrizzleDB.query.images.findMany({
                where: (images, { eq }) => and(eq(images.objectId, postedObject[i].id!), eq(images.objectType, postedObject[i].type!)),
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
     * @param {PostSchema[]|CommentSchema[]|CommentReplySchema[]} postedObject 
     *        Array of posts, comments, or comment replies to fetch images for
     * @returns {Promise<ImageWithBuffer[]>} Promise resolving to image objects with base64 data URLs
     * 
     * @see minioClient.getObject - S3 object retrieval
     * @requires minio - For S3 object storage access
     */
    static async getS3Objects(postedObject: PostSchema[] | CommentSchema[] | CommentReplySchema[]): Promise<ImageWithBuffer[]> {
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
}

export default ImageClient;