import { DrizzleDB } from "$lib/Drizzle.ts";
import type { CommentReplySchema } from "$lib/schemas/CommentReply.ts";
import type { CommentSchema } from "$lib/schemas/Comments.ts";
import { images, type ImageSchema } from "$lib/schemas/Images.ts";
import type { PostSchema } from "$lib/schemas/Posts.ts";
import { bucketName, minioClient } from "$lib/server/MinIOServer.server.ts";
import { and, eq } from "drizzle-orm";
import type { ImageWithUrl } from "$lib/@types/IImage.ts";
import { PUBLIC_MINIO_ENDPOINT } from "$env/static/public";
import type { PostWithImage } from "$lib/@types/IPostSerializer.ts";

type PostedObject = PostSchema | CommentSchema | CommentReplySchema | PostWithImage;
type PostedObjectArray = PostSchema[] | CommentSchema[] | CommentReplySchema[] | PostWithImage[];

const ImageService = {
  /**
   * @description When images are uploaded to the object storage bucket the ID of that image is stored
   * within the Image table in drizzle along with the object id and type. (object id and type refers to the Post/Comment/CommentReply objects and their types).
   * This is used to create a connection between the user's created post and image.
   *
   * Uses {@link DrizzleDB} to query the {@link ImageSchema} table
   * @param postedObject Single object or array of {@link PostSchema}, {@link CommentSchema}, or {@link CommentReplySchema}
   * @returns Image objects that exist within drizzle.
   */
  getDrizzleImageObjects: async (postedObject: PostedObject | PostedObjectArray): Promise<ImageSchema[]> => {
    const objectArray = Array.isArray(postedObject) ? postedObject : [postedObject];

    const objects: ImageSchema[] = [];
    for (let i = 0; i < objectArray.length; i++) {
      if (objectArray[i].id && objectArray[i].type) {
        const image = await DrizzleDB.query.images.findMany({
          where: (images, { eq: drizzleEq, and: drizzleAnd }) =>
            drizzleAnd(drizzleEq(images.objectId, objectArray[i].id!), drizzleEq(images.objectType, objectArray[i].type!)),
        });
        objects.push(...image);
      }
    }
    return objects;
  },

  /**
   * Retrieves presigned URLs for images from S3 object storage.
   *
   * First queries the database for image metadata using {@link getDrizzleImageObjects},
   * then generates a time-limited presigned URL for each image file from S3 storage.
   * These URLs can be used directly in `<img>` tags on the client-side.
   *
   * Uses {@link ImageService.getDrizzleImageObjects} to query the {@link ImageSchema} table.
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
  getS3Objects: async (postedObject: PostedObject | PostedObjectArray, expirySeconds: number = 3600): Promise<ImageWithUrl[]> => {
    // Note the explicit reference to ImageService.getDrizzleImageObjects
    const drizzleImageObjects = await ImageService.getDrizzleImageObjects(postedObject);
    const imagePromises = drizzleImageObjects.map(async (imageObj: ImageSchema): Promise<ImageWithUrl> => {
      try {
        const url = await minioClient.presignedGetObject(bucketName, imageObj.bucketObjectId, expirySeconds);
        const _url = new URL(url);
        // Ensure PUBLIC_MINIO_ENDPOINT is correctly formatted (e.g., without http/https)
        // You might need to adjust this based on how PUBLIC_MINIO_ENDPOINT is defined.
        // If it's a full URL, assigning it directly might be better.
        // If it's just a host/domain, then `_url.host = PUBLIC_MINIO_ENDPOINT` is correct.
        _url.host = PUBLIC_MINIO_ENDPOINT;

        return {
          id: imageObj.id!,
          objectId: imageObj.objectId,
          objectType: imageObj.objectType,
          url: _url.toString(),
          bucketObjectId: imageObj.bucketObjectId
        };
      } catch (error) {
        console.error(`Error generating presigned URL for ${imageObj.bucketObjectId}:`, error);
        return {
          id: imageObj.id!,
          objectId: imageObj.objectId,
          objectType: imageObj.objectType,
          url: '/path/to/placeholder-image.png',
          bucketObjectId: imageObj.bucketObjectId
        };
      }
    });

    return Promise.all(imagePromises);
  },

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
  removeDrizzleS3Objects: async (objects: {
    userId: string;
    objectId: string;
    objectType: string;
    bucketObjectId: string;
    id?: string | undefined;
  }[]): Promise<boolean> => {
    try {
      if (!objects) {
        throw new Error("Failed to get objects for image removal. 'objects' array is null or undefined.");
      }
      for (let i = 0; i < objects.length; i++) {
        if (!objects[i].id) {
          console.warn(`Skipping removal for object with missing ID: ${JSON.stringify(objects[i])}`);
          continue; 
        }
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
      throw new Error(`Failed to remove Drizzle S3 objects: ${error instanceof Error ? error.message : 'An unknown error occurred'}`, { cause: error });
    }
  }
};

export default ImageService;