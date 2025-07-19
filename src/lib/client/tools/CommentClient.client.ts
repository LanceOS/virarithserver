import { PUBLIC_URL } from '$env/static/public';
import type { SerializedComment } from '$lib/@types/ICommentSerializer.ts';
import type { CommentSchema } from '$lib/server/schemas/Comments.ts';

interface ICommentsParams {
	userId: string;
	page: number;
}

interface ICreateComment {
	postId: string;
	postUser: string;
	userId: string;
	content: string;
}

export const CommentClient = {
	/**
	 * Creates a new comment on a post.
	 * @param body - The details required to create the comment.
	 */
	createComment: async (body: ICreateComment) => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/comments/create/create_comment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			return await response.json();
		} catch (error) {
			console.error('Failed to create new comment', error);
			throw new Error(`Failed to create new comment: ${error}`);
		}
	},

	/**
	 * Updates an existing comment.
	 * @param comment - The full comment object with updated content.
	 */
	updateComment: async (comment: CommentSchema) => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/comments/edit/edit_comment`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(comment)
			});
			return await response.json();
		} catch (error: unknown) {
			throw new Error(`Failed to update comment: ${error}`);
		}
	},

	/**
	 * Deletes a comment. Note: This uses a PUT method for deletion.
	 * @param comment - The comment object to be deleted.
	 */
	deleteComment: async (comment: SerializedComment) => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/comments/delete`, {
				method: 'PUT', // Note: API uses PUT for deletion
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(comment)
			});
			return await response.json();
		} catch (error: unknown) {
			throw new Error(`Failed to delete comment: ${error}`);
		}
	},

	/**
	 * Retrieves all comments for a specific post.
	 * @param postId - The ID of the post whose comments are to be fetched.
	 */
	getCommentsByPost: async (postId: string) => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/comments/retrieve/get_by_post?postId=${postId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			console.error(`Failed to get comments for post ${postId}:`, error);
			throw new Error(`Failed to get comments by post: ${error}`);
		}
	},

	/**
	 * Retrieves all comments made by a specific user, with pagination.
	 * @param params - Contains the userId and page number.
	 */
	getCommentsByUser: async (params: ICommentsParams) => {
		try {
			const url = `${PUBLIC_URL}/api/comments/retrieve/get_by_user?userId=${params.userId}&page=${params.page}`;
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			console.error(`Failed to get comments for user ${params.userId}:`, error);
			throw new Error(`Failed to get comments by user: ${error}`);
		}
	}
};

export default CommentClient;