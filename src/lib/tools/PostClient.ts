import { PUBLIC_URL } from "$env/static/public";
import type { NewPost } from "$lib/schemas/Posts.ts";



class PostClient {
    interface: PostClient | null = null;

    constructor() {
        if(this.interface) return this.interface;
        this.interface = this;
    }

    /**
     * 
     * @param post 
     * @returns Returns the created post
     */
    static async createPost(post: NewPost) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/create`, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            })

            return response;
        }
        catch (error) {
            throw new Error(`Failed to create post: ${error}`)
        }
    }


    static async updatePost(post: NewPost) {
        console.log(post)
    }
}

export default PostClient;