import type { NewComment } from "$lib/@types/ICommentSerializer.ts";
import type { NewPost } from "$lib/@types/IPostSerializer.ts";
import type { IProfileWithUser } from "$lib/@types/IProfile.ts";
import { DrizzleDB } from "$lib/Drizzle.ts";
import { user } from "$lib/schemas/authentication.ts";
import { bucketName, minioClient } from "./MinIO.ts";


type ContentWithAvatar = NewPost | NewComment | IProfileWithUser;

class UserService {
    instance: UserService | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }


    static async updateUserAvatar(image: string) {
        try {
            const updatedUser = await DrizzleDB.update(user).set({
                image: image
            }).returning()

            return updatedUser;
        }
        catch(error) {
            throw new Error(`Failed to updated user avatar: ${error}`)
        }
    }

    static async alignUserAvatars<T extends ContentWithAvatar | ContentWithAvatar[]>(objectData: T): Promise<T> {
        try {
            const isArrayInput = Array.isArray(objectData);
            const objectArray = (isArrayInput ? objectData : [objectData]) as ContentWithAvatar[];

            const objectPromises = objectArray.map(async (object) => {
                const typedObject = object as ContentWithAvatar;

                if (typedObject.user?.image && typedObject.user.image !== 'placeholder') {
                    try {
                        const userAvatarUrl = await minioClient.presignedGetObject(bucketName, typedObject.user.image, 3600);
                        return {
                            ...typedObject,
                            user: {
                                ...typedObject.user,
                                image: userAvatarUrl
                            }
                        };
                    } catch (presignError) {
                        console.error(`Error generating presigned URL for image '${typedObject.user.image}':`, presignError);
                        return typedObject;
                    }
                } else {
                    return typedObject;
                }
            });

            const resolvedObjects = await Promise.all(objectPromises);

            return (isArrayInput ? resolvedObjects : resolvedObjects[0]) as T;

        } catch (error) {
            console.error("Error in alignUserAvatars:", error);
            throw error; 
        }
    }
}

export default UserService;