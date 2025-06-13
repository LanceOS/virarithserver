import { DrizzleDB } from "$lib/Drizzle.ts";
import type { CommentReplySchema } from "$lib/schemas/CommentReply.ts";
import type { CommentSchema } from "$lib/schemas/Comments.ts";
import type { ImageSchema } from "$lib/schemas/Images.ts";
import type { PostSchema } from "$lib/schemas/Posts.ts";
import { bucketName, minioClient } from "$lib/server/MinIO.ts";
import { and } from "drizzle-orm";
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';

interface ImageWithBuffer {
    id: string;
    url: string;
    bucketObjectId: string;
    objectId: string;
    objectType: string;
}

class ImageClient {
    instance: ImageClient | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    static async getDrizzleImageObjects(postedObject: PostSchema[] | CommentSchema[] | CommentReplySchema[]): Promise<ImageSchema[]> {
        const objects = []
        for (let i = 0; i < postedObject.length; i++) {
            const image = await DrizzleDB.query.images.findMany({
                where: (images, { eq }) => and(eq(images.objectId, postedObject[i].id!), eq(images.objectType, postedObject[i].type!)),
            })

            objects.push(...image)
        }

        await Promise.all(objects)
        return objects;
    };

    static async getS3Objects(drizzleImageObjects: ImageSchema[]): Promise<ImageWithBuffer[]> {
        const imagePromises = drizzleImageObjects.map(async (imageObj: ImageSchema): Promise<ImageWithBuffer> => {
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