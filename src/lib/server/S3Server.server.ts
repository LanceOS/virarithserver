import type { CommentReplySchema } from "$lib/schemas/CommentReply.ts";
import type { CommentSchema } from "$lib/schemas/Comments.ts";
import type { PostSchema } from "$lib/schemas/Posts.ts";
import { bucketName, minioClient } from "$lib/server/MinIOServer.server.ts";


interface IExistingObject {
    userId: string;
    objectId?: string;
    objectType?: string;
    bucketObjectId: string;
    id?: string | undefined;
}

type PostedObject = PostSchema | CommentSchema | CommentReplySchema;


const S3Service = {
    /**
     * @description Uploads multiple image files to the server, associating them with a specific object.
     * Each file is uploaded individually using a FormData object. The function returns a list
     * of IDs for the successfully uploaded files, which are then stored in both PostgreSQL and MinIO.
     *
     * @param {File} files An array of `File` objects to be uploaded. Each `File` object represents an image.
     * @param {PostedObject} object An object conforming to `PostSchema`, `CommentSchema`, or `CommentReplySchema`.
     * This object must contain `id` and `type` properties, which are used to associate the uploaded
     * images with the respective database record.
     * @param {FetchFunction} fetchFn The `fetch` function or a compatible mock function, used for making API requests.
     * This allows for dependency injection and easier testing.
     * @returns {Promise<string[]>} A `Promise` that resolves to an array of `string`s. Each string is the unique ID
     * of a successfully uploaded file, as returned by the backend service.
     * @throws {Error} If `object.id` or `object.type` are missing, or if any upload operation fails.
     * Specific error messages will indicate the cause of failure, including network issues or
     * server-side errors.
     */
    uploadImages: async (files: File[], object: PostedObject, fetchFn: typeof fetch): Promise<string[]> => {
        const successfulIds: string[] = [];
        for await (const file of files) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                if (!object?.id || !object?.type) {
                    throw new Error(`Missing object fields: object.id or object.type are undefined.`);
                }

                formData.append('objectId', object.id);
                formData.append('objectType', object.type);

                const response = await fetchFn('/api/objects/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'No additional error details.' }));
                    throw new Error(`Upload failed for file "${file.name}" with status ${response.status}: ${errorData.message || response.statusText}`, { cause: errorData });
                }

                const result = await response.json();
                successfulIds.push(result.id || result); 
            } catch (error) {
                console.error(`S3Service upload error for file "${file?.name || 'unknown'}":`, error);
                throw new Error(`Upload process failed: ${error instanceof Error ? error.message : 'An unknown error occurred during upload.'}`, { cause: error });
            }
        }
        return successfulIds;
    },


    /**
     * @description Deletes one or more image files from MinIO storage.
     * This function iterates through the provided object(s) and attempts to remove each corresponding
     * image from the configured MinIO bucket.
     *
     * @param {IExistingObject | IExistingObject[] } objects An `IExistingObject` or an array of `IExistingObject`s. Each object must contain
     * a `bucketObjectId` property, which is the unique identifier for the image file in MinIO.
     * @returns {Promise<boolean>} A `Promise` that resolves to `true` if all specified images were successfully
     * removed from MinIO.
     * @throws {Error} If the deletion of any image fails. The error message will include
     * details about the failure.
     */
    deleteImages: async (objects: IExistingObject | IExistingObject[]): Promise<boolean> => {
        const objectArray = Array.isArray(objects) ? objects : [objects];

        console.log("Attempting to remove images...");
        for (const obj of objectArray) {
            if (!obj.bucketObjectId) {
                console.warn(`Skipping deletion for an object due to missing 'bucketObjectId':`, obj);
                continue;
            }
            try {
                await minioClient.removeObject(bucketName, obj.bucketObjectId);
                console.log(`Successfully removed image with bucketObjectId: ${obj.bucketObjectId}`);
            } catch (error) {
                console.error(`Failed to remove image with bucketObjectId "${obj.bucketObjectId}":`, error);
                throw new Error(`Failed to remove images. Encountered error with ${obj.bucketObjectId}.`, { cause: error });
            }
        }
        return true;
    },

    /**
     * @description Uploads a user's avatar image to the server.
     *
     * @param {File} file The `File` object representing the user's avatar image.
     * @param {string} userId The ID of the user whose avatar is being uploaded.
     * @param {FetchFunction} fetchFn The `fetch` function or a compatible mock function, used for making API requests.
     * @returns {Promise<string>} A `Promise` that resolves to the `bucketId` of the uploaded avatar.
     * @throws {Error} If the upload operation fails.
     */
    uploadUserAvatar: async (file: File, userId: string, fetchFn: typeof fetch): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);

            const response = await fetchFn('/api/user/upload-avatar', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No additional error details.' }));
                throw new Error(`Upload failed for avatar "${file.name}" with status ${response.status}: ${errorData.message || response.statusText}`, { cause: errorData });
            }

            const result = await response.json();
            if (!result.bucketId) {
                throw new Error(`API response missing 'bucketId' for avatar upload: ${JSON.stringify(result)}`);
            }
            return result.bucketId;
        } catch (error) {
            console.error(`S3Service upload error for avatar "${file?.name || 'unknown'}":`, error);
            throw new Error(`Upload process failed: ${error instanceof Error ? error.message : 'An unknown error occurred during upload.'}`, { cause: error });
        }
    }
};

export default S3Service;