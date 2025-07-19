import { PUBLIC_URL } from '$env/static/public';

interface ILikesParams {
	userId: string;
	page: number;
}

interface ILikeObjectData {
	senderId: string;
	receiverId: string;
	objectId: string;
	objectType: string;
}

export const LikeClient = {
	/**
	 * Sends a 'like' action for a specific object (e.g., post, comment).
	 * @param data - The details of the like action.
	 */
	likeObject: async (data: ILikeObjectData): Promise<boolean> => {
		try {
			await fetch(`${PUBLIC_URL}/api/like/like`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			return true;
		} catch (error) {
			console.error(`Failed to like object: ${error}`);
			throw new Error(`Failed to like object: ${error}`);
		}
	},

	/**
	 * Removes a 'like' from a specific object.
	 * @param data - The details of the unlike action.
	 */
	unlikeObject: async (data: ILikeObjectData): Promise<boolean> => {
		try {
			await fetch(`${PUBLIC_URL}/api/like/unlike`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			return true;
		} catch (error) {
			throw new Error(`Failed to unlike object: ${error}`);
		}
	},

	/**
	 * Retrieves all items liked by a specific user, with pagination.
	 * @param params - Contains the userId and the page number.
	 */
	getLikesByUser: async (params: ILikesParams) => {
		try {
			const url = `${PUBLIC_URL}/api/like/retrieve/get_by_user?userId=${params.userId}&page=${params.page}`;
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get liked items by user: ${error}`);
		}
	}
};

export default LikeClient;