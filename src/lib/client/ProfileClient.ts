import { PUBLIC_URL } from '$env/static/public';

class ProfileClient {
    instance: ProfileClient | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    static async getUserProfile(userId: string) {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/profile/retrieve?userId=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            return data;
        }
        catch (error) {
            throw new Error(`Failed to get user profile: ${error}`)
        }
    }
}

export default ProfileClient