import { PUBLIC_URL } from '$env/static/public';

export const ProfileClient = {
	/**
	 * Retrieves a user's profile data.
	 * @param userId - The ID of the user whose profile is to be fetched.
	 */
	getUserProfile: async (userId: string) => {
		try {
			const response = await fetch(`${PUBLIC_URL}/api/profile/retrieve?userId=${userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return await response.json();
		} catch (error) {
			throw new Error(`Failed to get user profile: ${error}`);
		}
	}
};

export default ProfileClient;