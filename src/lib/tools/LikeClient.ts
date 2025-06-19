import { PUBLIC_URL } from "$env/static/public";
import type { LikeSchema } from "$lib/schemas/Likes.ts";



interface ILikesParams {
    userId: string;
    page: number;
}
class LikeClient {
    instance: LikeClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }


    static async likeObject(data: LikeSchema) {
        try {
            await fetch(`${PUBLIC_URL}/api/like/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            return true;
        }
        catch(error) {
            throw new Error(`Failed to like object: ${error}`)
        }
    }

    static async unlikeObject(data: LikeSchema) {
        try {
            await fetch(`${PUBLIC_URL}/api/like/unlike`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            return true;
        }
        catch(error) {
            throw new Error(`Failed to like object: ${error}`)
        }
    }

    static async getLikesByUser(params: ILikesParams) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/like/retrieve/get_by_user?userId=${params.userId}&page=${params.page}`, {
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const data = await response.json(); 
            return data;
        }
        catch (error) {
            throw new Error(`Failed to get post: ${error}`)
        }
    }
}


export default LikeClient;