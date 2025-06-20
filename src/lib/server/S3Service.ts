import type { CommentReplySchema } from "$lib/schemas/CommentReply.ts";
import type { CommentSchema } from "$lib/schemas/Comments.ts";
import type { PostSchema } from "$lib/schemas/Posts.ts";
import { bucketName, minioClient } from "$lib/server/MinIO.ts";


interface IExistingObject {
    userId: string;
    objectId?: string;
    objectType?: string;
    bucketObjectId: string;
    id?: string | undefined;
}


class S3Service {
    instance: S3Service | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = null;
    }

    /**
     * Uploads multiple image files to the server, associating them with a specific object.
     * Each file is uploaded individually using a FormData object. The function returns a list
     * of IDs for the successfully uploaded files, which are then stored in both PostgreSQL and MinIO.
     *
     * @param files An array of `File` objects to be uploaded. Each `File` object represents an image.
     * @param object An object conforming to `PostSchema`, `CommentSchema`, or `CommentReplySchema`.
     * This object must contain `id` and `type` properties, which are used to associate the uploaded
     * images with the respective database record.
     * @param fetchFn The `fetch` function or a compatible mock function, used for making API requests.
     * This allows for dependency injection and easier testing.
     * @returns A `Promise` that resolves to an array of `string`s. Each string is the unique ID
     * of a successfully uploaded file, as returned by the backend service.
     * @throws {Error} If `object.id` or `object.type` are missing, or if any upload operation fails.
     * Specific error messages will indicate the cause of failure, including network issues or
     * server-side errors.
     */
    static async uploadImages(files: File[], object: PostSchema | CommentSchema | CommentReplySchema, fetchFn: typeof fetch): Promise<string[]> {
        const successfullIds: string[] = [];
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
                    throw new Error(`Upload failed for file "${file.name}" with status ${response.status}: ${errorData.message || response.statusText}`);
                }

                const result = await response.json();
                successfullIds.push(result);
            } catch (error) {
                console.error(`S3Client upload error for file "${file?.name || 'unknown'}":`, error instanceof Error ? error.message : error);
                throw new Error(`Upload process failed: ${error instanceof Error ? error.message : 'An unknown error occurred during upload.'}`);
            }
        }
        return successfullIds;
    }


    /**
     * Deletes one or more image files from MinIO storage.
     * This function iterates through the provided object(s) and attempts to remove each corresponding
     * image from the configured MinIO bucket.
     *
     * @param objects An `IExistingObject` or an array of `IExistingObject`s. Each object must contain
     * a `bucketObjectId` property, which is the unique identifier for the image file in MinIO.
     * @returns A `Promise` that resolves to `true` if all specified images were successfully
     * removed from MinIO.
     * @throws {Error} If the deletion of any image fails. The error message will include
     * details about the failure.
     */
    static async deleteImages(objects: IExistingObject | IExistingObject[]): Promise<boolean> {
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
                console.error(`Failed to remove image with bucketObjectId "${obj.bucketObjectId}":`, error instanceof Error ? error.message : error);
                throw new Error(`Failed to remove images. Encountered error with ${obj.bucketObjectId}: ${error instanceof Error ? error.message : 'An unknown error occurred during deletion.'}`);
            }
        }
        return true;
    }


    static async uploadUserAvatar(file: File, userId: string, fetchFn: typeof fetch): Promise<string> {
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
                throw new Error(`Upload failed for avatar "${file.name}" with status ${response.status}: ${errorData.message || response.statusText}`);
            }
    
            const result = await response.json();
            return result.bucketId;
        } catch (error) {
            console.error(`S3Client upload error for avatar "${file?.name || 'unknown'}":`, error instanceof Error ? error.message : error);
            throw new Error(`Upload process failed: ${error instanceof Error ? error.message : 'An unknown error occurred during upload.'}`);
        }
    }
}

export default S3Service;