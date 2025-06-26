import type { NewComment } from "$lib/@types/ICommentSerializer.ts";
import type { NewPost } from "$lib/@types/IPostSerializer.ts";
import { bucketName, minioClient } from "./MinIO.ts";




type PostedObject = NewPost | NewComment;
type PostedObjectArray = (NewPost | NewComment)[];


class AvatarService {
    interface: AvatarService | null = null;

    constructor() {
        if (this.interface) return this.interface;
        this.interface = this;
    }


    static async alignUserAvatars(objectData: PostedObject | PostedObjectArray): Promise<PostedObject | PostedObjectArray> {
        try {
            const objectArray = Array.isArray(objectData) ? objectData : [objectData];

            const objectPromises = objectArray.map(async (object) => {
                if (object.user.image && object.user.image !== 'placeholder') {
                    const userAvatarUrl = await minioClient.presignedGetObject(bucketName, object.user.image, 3600)
                    return {
                        ...object,
                        user: {
                            ...object.user,
                            image: userAvatarUrl
                        }
                    }
                }
                else {
                    return object
                }
            })

            const resolvedObjects = await Promise.all(objectPromises);

            if (!Array.isArray(objectData)) {
                return resolvedObjects[0];
            }

            return resolvedObjects;
        }
        catch (error) {
            console.log(error)
            throw new Error("Failed to align user avatars");
        }
    }
}

export default AvatarService;