import { PUBLIC_URL } from '$env/static/public';
import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
import type { UserSchema } from '$lib/schemas/authentication.ts';
import type { CommentReplySchema } from '$lib/schemas/CommentReply.ts';
import type { CommentSchema } from '$lib/schemas/Comments.ts';

interface IFollow {
	receiverId: string;
	objectId: string;
}

class UserClient {
	instance: UserClient | null = null;

	constructor() {
		if (this.instance) return this.instance;
		this.instance = this;
	}

	static async deleteUser() {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/user/delete`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response) {
				return true;
			}
		} catch (error) {
			console.error(error);
			throw new Error(`Failed to delete user ${error}`);
		}
	}

	static async followUser(body: IFollow): Promise<boolean> {
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
	}

	static async getFollowers(userId: string | undefined) {
		if (!userId) {
			return [];
		}

		try {
			const response = await fetch(`${PUBLIC_URL}/api/following/get_followers?userId=${userId}`, {
				method: 'GET'
			});

			const data = await response.json();
			return data;
		} catch (error) {
			throw new Error(`Failed to get followers: ${error}`);
		}
	}

	static async unfollowUser(body: IFollow): Promise<boolean> {
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
				body: JSON.stringify(body)
			});

			return true;
		} catch (error) {
			throw new Error(error as string);
		}
	}

	static async getUserByName(name: string): Promise<UserSchema> {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/user/retrieve/get_by_name?name=${name}`, {
				method: 'GET'
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error);
			}
			const data = await response.json();
			return data;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	static async userReportTool(object: PostWithImage | CommentSchema | CommentReplySchema) {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(object)
            });

            const data = await response.json()
            return data
		} catch (error: any) {
            throw new Error(error.message)
		}
	}
}

export default UserClient;
