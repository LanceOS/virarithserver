import type { SerializedComment } from "$lib/@types/ICommentSerializer.ts";
import type { NewPost } from "$lib/@types/IPostSerializer.ts";
import { bucketName, minioClient } from "./MinIOServer.server.ts";

type PostedObject = NewPost | SerializedComment;
type PostedObjectArray = (NewPost | SerializedComment)[];

const AvatarService = {
  /**
   * Aligns user avatars by generating presigned URLs for their images.
   * If the user's image is present and not a 'placeholder', a presigned URL is generated.
   *
   * @param objectData A single PostedObject or an array of PostedObjects.
   * @returns A Promise that resolves to the modified PostedObject or PostedObjectArray with updated avatar URLs.
   * @throws {Error} If there's an error during the alignment process (e.g., MinIO error).
   */
  alignUserAvatars: async (objectData: PostedObject | PostedObjectArray): Promise<PostedObject | PostedObjectArray> => {
    try {
      const objectArray = Array.isArray(objectData) ? objectData : [objectData];

      const objectPromises = objectArray.map(async (object) => {
        if (object.user.image && object.user.image !== 'placeholder') {
          const userAvatarUrl = await minioClient.presignedGetObject(bucketName, object.user.image, 3600);
          return {
            ...object,
            user: {
              ...object.user,
              image: userAvatarUrl
            }
          };
        } else {
          // If no image or it's a placeholder, return the object as is
          return object;
        }
      });

      const resolvedObjects = await Promise.all(objectPromises);

      // If the original input was a single object, return the first resolved object
      if (!Array.isArray(objectData)) {
        return resolvedObjects[0];
      }

      return resolvedObjects;
    } catch (error) {
      console.error("Error aligning user avatars:", error); 
      throw new Error("Failed to align user avatars", { cause: error }); 
    }
  }
};

export default AvatarService;