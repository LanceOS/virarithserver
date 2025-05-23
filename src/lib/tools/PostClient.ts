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

    /**
     * 
     * @returns Returns all posts from the database
     */
    static async getAllPosts() {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve`, {
                headers: {
                    "Content-Type": "application/json"
                },
            })

            return response;
        }
        catch (error) {
            throw new Error(`Failed to create post: ${error}`)
        }
    }

    /**
     * 
     * @param params 
     * @returns Returns the posts sorted by the selected topic
     */
    static async getPostsByTopic(params: string) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve?topic=${params}`, {
                headers: {
                    "Content-Type": "application/json"
                },
            })

            return response;
        }
        catch (error) {
            throw new Error(`Failed to create post: ${error}`)
        }
    }

    /**
     * 
     * @param params 
     * @returns Returns the posts sorted by the user
     */
    static async getPostsByUser(params: string) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve?userId=${params}`, {
                headers: {
                    "Content-Type": "application/json"
                },
            })

            return response;
        }
        catch (error) {
            throw new Error(`Failed to create post: ${error}`)
        }
    }
}

export default PostClient;