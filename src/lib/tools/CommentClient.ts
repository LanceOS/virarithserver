import { PUBLIC_URL } from "$env/static/public";
import type { CommentSchema } from "$lib/schemas/Comments.ts";

interface ICommentsParams {
    userId: string;
    page: number;
}


class CommentClient {
    instance: CommentClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }

    static async createComment(params: CommentSchema) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/comments/create/create_comment`, {
                method: "POST",
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

    static async updateComment(comment: CommentSchema) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/comments/edit/edit_comment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(comment)
            })

            const data = await response.json()
            return data;
        }
        catch(error: unknown) {
            throw new Error(`Failed to update comment ${error}`)
        }
    }

    static async deleteComment(comment: CommentSchema) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/comments/delete`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(comment)
            })

            const data = await response.json()
            return data;
        }
        catch(error: unknown) {
            throw new Error(`Failed to delete comment ${error}`)
        }
    }

    static async getCommentsByPost(post: string) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/comments/retrieve/get_by_post?postId=${post}`, {
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

    static async getCommentsByUser(params: ICommentsParams) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/comments/retrieve/get_by_user?userId=${params.userId}&page=${params.page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
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