import { PUBLIC_URL } from "$env/static/public";
import type { NewPost } from "$lib/schemas/Posts.ts";


interface IPostParams {
    category?: string;
    userId?: string;
    page: number;
}


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
    static async getAllPosts(params: IPostParams) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve/get_all?page=${params.page}`, {
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
     * @returns Returns the posts sorted by the selected category
     */
    static async getPostsByCategory(params: IPostParams) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve/get_by_category?category=${params.category}$page=${params.page}`, {
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
    static async getPostsByUser(params: IPostParams) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve/get_by_user?userId=${params.userId}&page=${params.page}`, {
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