import { PUBLIC_URL } from "$env/static/public";
import type { NewComment } from "$lib/schemas/Comments.ts";


class CommentClient {
    instance: CommentClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }

    static async createComment(params: NewComment) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/comments/create/create_comment`, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params)
            })

            const data = await response.json()
            return data;
        }
        catch(error) {
            console.error("Failed to create new comment", error)
        }
    }

    static async getCommentsByPost(params: string) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/comments/retrieve/get_by_post?postId=${params}`, {
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const data = await response.json()
            return data;
        }
        catch(error) {
            console.error("Failed to create new comment", error)
        }
    }

}

export default CommentClient;