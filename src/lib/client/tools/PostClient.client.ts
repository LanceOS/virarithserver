import { PUBLIC_URL } from '$env/static/public';
import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';

interface IPostParams {
	category?: string;
	userId?: string;
	page: number;
}

export const PostClient = {
	/**
	 * Deletes a post. Note: This uses a PUT method for deletion.
	 * @param post - The post object to delete.
	 */
	deletePost: async (post: PostWithImage) => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/posts/delete`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(post)
			});
			return await response.json();
		} catch (error: unknown) {
			throw new Error(`Failed to delete post: ${error}`);
		}
	},

	/**
	 * Fetches all posts from the database, paginated and ordered.
	 * @param orderBy - The sorting order for the posts.
	 * @param page - The page number to fetch.
	 */
	getAllPosts: async (orderBy: string, page: number) => {
		try {
			const url = `${PUBLIC_URL}/api/posts/retrieve/get_all?page=${page}&orderBy=${orderBy}`;
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get posts: ${error}`);
		}
	},

	/**
	 * Fetches posts filtered by a specific category.
	 * @param orderBy - The sorting order for the posts.
	 * @param category - The category to filter by.
	 * @param page - The page number to fetch.
	 */
	getPostsByCategory: async (orderBy: string, category: string, page: number) => {
		try {
			if (!category) {
				throw new Error('A category must be provided.');
			}
			const url = `${PUBLIC_URL}/api/posts/retrieve/get_by_cat?category=${category}&page=${page}&orderBy=${orderBy}`;
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get posts by category: ${error}`);
		}
	},

	/**
	 * Fetches posts created by a specific user.
	 * @param params - Contains the userId and page number.
	 */
	getPostsByUser: async (params: IPostParams) => {
		try {
			const url = `${PUBLIC_URL}/pages/profile?userId=${params.userId}&page=${params.page}`;
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get posts by user: ${error}`);
		}
	},

	/**
	 * Fetches a single post by its ID.
	 * @param postId - The ID of the post to fetch.
	 */
	getPostById: async (postId: string) => {
		try {
			const response = await fetch(`${PUBLIC_URL}/pages/posts?postId=${postId}`, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get post by ID: ${error}`);
		}
	},

	/**
	 * Fetches the most recent announcement post.
	 */
	getLatestAnnouncementPost: async (): Promise<PostWithImage> => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/posts/retrieve/announcement_latest`, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get latest announcement: ${error}`);
		}
	},

	/**
	 * Fetches posts from users that the current user is following.
	 * @param orderBy - The sorting order for the posts.
	 * @param page - The page number to fetch.
	 */
	getByFollowing: async (orderBy: string, page: number): Promise<PostWithImage[]> => {
		try {
			const url = `${PUBLIC_URL}/api/posts/retrieve/get_by_following?orderBy=${orderBy}&page=${page}`;
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get posts from followed users: ${error}`);
		}
	}
};

export default PostClient;