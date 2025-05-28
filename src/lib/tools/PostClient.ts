import { PUBLIC_URL } from "$env/static/public";
import type { PostSchema } from "$lib/schemas/Posts.ts";


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
    static async createPost(post: PostSchema) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/create`, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            })
            const data = await response.json(); 
            return data;
        }
        catch (error) {
            throw new Error(`Failed to create post: ${error}`)
        }
    }


    static async updatePost(post: PostSchema) {
        console.log(post)
    }

    /**
     * 
     * @returns Fetches all posts from the database
     */
    static async getAllPosts(page: number) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve/get_all?page=${page}`, {
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

    /**
     * 
     * @param params 
     * @returns Fetches posts sorted by the selected category
     */
    static async getPostsByCategory(params: IPostParams) {
        try {
            if(!params.category) {
                throw new Error("A category must be provided.")
            }

            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve/get_by_cat?category=${params.category}&page=${params.page}`, {
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

    /**
     * 
     * @param params 
     * @returns Fetches post sorted by user
     */
    static async getPostsByUser(params: IPostParams) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve/get_by_user?userId=${params.userId}&page=${params.page}`, {
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


    /**
     * 
     * @param postId 
     * @returns Fetches post by Id
     */
    static async getPostById(postId: string) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve/get_by_id?postId=${postId}`, {
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

export default PostClient;