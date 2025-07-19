import { PUBLIC_URL, PUBLIC_MINIO_ENDPOINT } from "$env/static/public";
import { DrizzleDB } from "$lib/Drizzle.ts";
import { user } from "$lib/server/schemas/authentication.ts";
import { eq, or } from "drizzle-orm";

import { bucketName, minioClient } from "$lib/server/tools/MinIOServer.server.ts";

import type { NewPost } from "$lib/@types/IPostSerializer.ts";
import type { SerializedComment } from "$lib/@types/ICommentSerializer.ts";
import type { IProfileWithUser } from "$lib/@types/IProfile.ts";


type ContentWithAvatar = NewPost | SerializedComment | IProfileWithUser;


const UserService = {
    /**
     * Updates the image ID (e.g., avatar) for a specific user in the database.
     *
     * @param image The new image ID (e.g., MinIO object ID) to set for the user.
     * @param userId The ID of the user whose image is being updated.
     * @returns A Promise that resolves to the updated user record(s).
     * @throws {Error} If the update operation fails.
     */
    updateUserImageId: async (image: string, userId: string) => {
        try {
            const updatedUser = await DrizzleDB.update(user).set({
                image: image
            }).where(eq(user.id, userId))
                .returning();

            // Check if any user was actually updated
            if (!updatedUser || updatedUser.length === 0) {
                throw new Error(`No user found with ID ${userId} to update image.`);
            }

            return updatedUser;
        }
        catch (error) {
            console.error(`Error updating user avatar for user ${userId} with image ${image}:`, error);
            throw new Error(`Failed to update user avatar.`, { cause: error });
        }
    },

    /**
     * Retrieves a list of users who hold staff roles (developer, moderator, admin, founder).
     *
     * @returns A Promise that resolves to an array of user objects with staff roles.
     * @throws {Error} If the retrieval of staff members fails.
     */
    getStaffUsers: async () => {
        try {
            const users = await DrizzleDB.query.user.findMany({
                where: or(
                    eq(user.role, "developer"),
                    eq(user.role, "moderator"),
                    eq(user.role, "admin"),
                    eq(user.role, "founder")
                )
            });

            return users;
        }
        catch (error) {
            console.error("Error fetching staff members:", error);
            throw new Error(`Failed to get staff members.`, { cause: error });
        }
    },

    /**
     * Sends a request to the backend API to delete the current user's account.
     * Assumes the backend handles authentication and identifies the user to delete.
     *
     * @returns A Promise that resolves to `true` if the deletion request is successful.
     * @throws {Error} If the API request fails or returns a non-OK status.
     */
    deleteUser: async () => {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/user/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No additional error details.' }));
                throw new Error(`Failed to delete user account: ${response.status} - ${errorData.message || response.statusText}`, { cause: errorData });
            }

            return true;
        }
        catch (error) {
            console.error("Error deleting user account:", error);
            throw new Error(`Failed to delete user account.`, { cause: error });
        }
    },

    /**
     * @note THIS FUNCTION IS IF YOU PLAN ON USING EMAIL AND PASSWORD FOR AUTHENTICATION
     * OTHERWISE DO NOT USE THIS FUNCTION!
     * @Description This function is used to gather user avatars from an S3-compatible bucket
     * and align them with provided objects (e.g., posts, comments, profiles).
     * It generates presigned URLs for user images if they exist and are not placeholders or already URLs.
     *
     * @template T A type extending `ContentWithAvatar` or an array of `ContentWithAvatar`.
     * @param {T} objectData A single object or an array of objects containing user information (specifically, `user.image`).
     * @returns {Promise<T>} A Promise that resolves to the input `objectData` with user avatar `image` properties
     * updated to presigned URLs where applicable.
     * @throws {Error} If an unexpected error occurs during the avatar alignment process. Individual presigning
     * errors for specific images are logged but do not stop the entire process.
     */
    alignUserAvatars: async <T extends ContentWithAvatar | ContentWithAvatar[]>(objectData: T): Promise<T> => {
        try {
            const isArrayInput = Array.isArray(objectData);
            const objectArray = (isArrayInput ? objectData : [objectData]) as ContentWithAvatar[];

            const objectPromises = objectArray.map(async (object) => {
                const typedObject = object as ContentWithAvatar;

                if (typedObject.user?.image && typedObject.user.image !== 'placeholder' && !typedObject.user.image.includes("https://")) {
                    try {
                        const userAvatarUrl = await minioClient.presignedGetObject(bucketName, typedObject.user.image, 3600);

                        const _url = new URL(userAvatarUrl);
                        // IMPORTANT: Ensure PUBLIC_MINIO_ENDPOINT is correctly formatted (e.g., domain only)
                        // If PUBLIC_MINIO_ENDPOINT includes protocol, use _url = new URL(PUBLIC_MINIO_ENDPOINT + path)
                        // or other methods to correctly set the host if needed.
                        _url.host = PUBLIC_MINIO_ENDPOINT;

                        return {
                            ...typedObject,
                            user: {
                                ...typedObject.user,
                                image: _url.toString()
                            }
                        };
                    } catch (presignError) {
                        console.error(`Error generating presigned URL for image '${typedObject.user.image}':`, presignError);
                        // If presigning fails for one image, return the object without changing its image URL
                        // This prevents the entire operation from failing due to one bad image.
                        return typedObject;
                    }
                } else {
                    // If no image, it's a placeholder, or already a URL, return the object as is
                    return typedObject;
                }
            });

            const resolvedObjects = await Promise.all(objectPromises);

            // Return a single object if the input was a single object, otherwise return the array
            return (isArrayInput ? resolvedObjects : resolvedObjects[0]) as T;

        } catch (error) {
            console.error("Critical error in alignUserAvatars:", error);
            throw new Error(`Failed to align user avatars.`, { cause: error });
        }
    }
};

export default UserService;