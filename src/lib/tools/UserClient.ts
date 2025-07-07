import { PUBLIC_URL } from "$env/static/public";
import type { UserSchema } from "$lib/schemas/authentication.ts";



interface IFollow {
    recieverId: string;
    objectId: string;
}

class UserClient {
    instance: UserClient | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }



    static async deleteUser() {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/user/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response) {
                return true;
            }
        }
        catch (error) {
            console.error(error)
            throw new Error(`Failed to delete user ${error}`)
        }
    }


    static async followUser(body: IFollow): Promise<boolean> {
        try {
            await fetch(`${PUBLIC_URL}/api/following/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            return true;
        }
        catch (error) {
            throw new Error(`Failed to follow user: ${error}`)
        }
    }

    static async getFollowers(userId: string | undefined) {
        if (!userId) {
            return []
        }

        try {
            const response = await fetch(`${PUBLIC_URL}/api/following/get_followers?userId=${userId}`, {
                method: "GET"
            });

            const data = await response.json()
            return data;
        }
        catch (error) {
            throw new Error(`Failed to get followers: ${error}`)
        }
    }

    static async unfollowUser(body: IFollow): Promise<boolean> {
        const params = new URLSearchParams({
            recieverId: body.recieverId,
            objectId: body.objectId,
        }).toString();

        try {
            await fetch(`${PUBLIC_URL}/api/following/unfollow?${params}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            return true;
        }
        catch (error) {
            throw new Error(`Failed to follow user: ${error}`)
        }
    }


    static async getUserByName(name: string): Promise<UserSchema> {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/user/retrieve/get_by_name?name=${name}`, {
                method: "GET",
            })
            const data = await response.json()
            return data
        }
        catch(error) {
            throw new Error(error as string)
        }
    }
}

export default UserClient;