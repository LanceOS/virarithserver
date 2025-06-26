import { PUBLIC_URL } from "$env/static/public";
import { DrizzleDB } from "$lib/Drizzle.ts";
import { user } from "$lib/schemas/authentication.ts";
import { eq, or } from "drizzle-orm";


// type ContentWithAvatar = NewPost | NewComment | IProfileWithUser;

class UserService {
    instance: UserService | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }


    static async updateUserImageId(image: string, userId: string) {
        try {
            const updatedUser = await DrizzleDB.update(user).set({
                image: image
            }).where(eq(user.id, userId))
            .returning()

            return updatedUser;
        }
        catch(error) {
            throw new Error(`Failed to updated user avatar: ${error}`)
        }
    }


    static async getStaffUsers() {
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
        catch(error) {
            throw new Error(`Failed to get staff members: ${error}`)
        }
    }


    static async deleteUser() {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/user/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if(response) {
                return true;
            }
        }
        catch(error) {
            throw new Error(`Failed to delete user ${error}`)
        }
    }

    /**
     * @Description IF YOU ARE GOING TO ADD USER EMAIL AND PASSWORDS AS SIGN IN USE THIS FUNCTION TO GATHER USER AVATARS FROM BUCKET
     * AND ALIGN THEM WITH OBJECTS
     */
    // static async alignUserAvatars<T extends ContentWithAvatar | ContentWithAvatar[]>(objectData: T): Promise<T> {
    //     try {
    //         const isArrayInput = Array.isArray(objectData);
    //         const objectArray = (isArrayInput ? objectData : [objectData]) as ContentWithAvatar[];

    //         const objectPromises = objectArray.map(async (object) => {
    //             const typedObject = object as ContentWithAvatar;

    //             if (typedObject.user?.image && typedObject.user.image !== 'placeholder' && !typedObject.user.image.includes("https")) {
    //                 try {
    //                     const userAvatarUrl = await minioClient.presignedGetObject(bucketName, typedObject.user.image, 3600);

                    // let _url = new URL(userAvatarUrl);
                    // _url.host = PUBLIC_MINIO_ENDPOINT
    //                     return {
    //                         ...typedObject,
    //                         user: {
    //                             ...typedObject.user,
    //                             image: _url
    //                         }
    //                     };
    //                 } catch (presignError) {
    //                     console.error(`Error generating presigned URL for image '${typedObject.user.image}':`, presignError);
    //                     return typedObject;
    //                 }
    //             } else {
    //                 return typedObject;
    //             }
    //         });

    //         const resolvedObjects = await Promise.all(objectPromises);

    //         return (isArrayInput ? resolvedObjects : resolvedObjects[0]) as T;

    //     } catch (error) {
    //         console.error("Error in alignUserAvatars:", error);
    //         throw error; 
    //     }
    // }
}

export default UserService;