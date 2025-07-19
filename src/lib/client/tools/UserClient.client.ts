import { PUBLIC_URL } from '$env/static/public';
import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
import type { UserSchema } from '$lib/server/schemas/authentication.ts';
import type { CommentReplySchema } from '$lib/server/schemas/CommentReply.ts';
import type { CommentSchema } from '$lib/server/schemas/Comments.ts';

interface IFollow {
	receiverId: string;
	objectId: string;
}

export const UserClient = {
	/**
	 * Deletes the currently authenticated user.
	 */
	deleteUser: async (): Promise<boolean | undefined> => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/user/delete`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				return true;
			}
		} catch (error) {
			console.error('Failed to delete user:', error);
			throw new Error(`Failed to delete user: ${error}`);
		}
	},

	/**
	 * Follows another user.
	 * @param body - Contains the receiverId and objectId.
	 */
	followUser: async (body: IFollow): Promise<boolean> => {
		try {
			await fetch(`${PUBLIC_URL}/api/following/follow`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			return true;
		} catch (error) {
			throw new Error(`Failed to follow user: ${error}`);
		}
	},

	/**
	 * Retrieves the followers for a given user.
	 * @param userId - The ID of the user whose followers are to be fetched.
	 */
	getFollowers: async (userId: string | undefined) => {
		if (!userId) {
			return [];
		}

		try {
			const response = await fetch(`${PUBLIC_URL}/api/following/get_followers?userId=${userId}`);
			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get followers: ${error}`);
		}
	},

	/**
	 * Unfollows a user.
	 * @param body - Contains the receiverId and objectId.
	 */
	unfollowUser: async (body: IFollow): Promise<boolean> => {
		const params = new URLSearchParams({
			receiverId: body.receiverId,
			objectId: body.objectId
		}).toString();

		try {
			await fetch(`${PUBLIC_URL}/api/following/unfollow?${params}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body) // Note: Body in DELETE might not be supported everywhere
			});
			return true;
		} catch (error: any) {
			throw new Error(error.message);
		}
	},

	/**
	 * Retrieves a user profile by their name.
	 * @param name - The name of the user to retrieve.
	 */
	getUserByName: async (name: string): Promise<UserSchema> => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/user/retrieve/get_by_name?name=${name}`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error);
			}
			return await response.json();
		} catch (error: any) {
			throw new Error(error.message);
		}
	},

	/**
	 * Submits a report for a post, comment, or reply.
	 * @param object - The content to be reported.
	 */
	userReportTool: async (object: PostWithImage | CommentSchema | CommentReplySchema) => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/reports`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(object)
			});
			return await response.json();
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
};

export default UserClient;