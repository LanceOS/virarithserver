import { PUBLIC_URL } from "$env/static/public";
import type { ProfileSchema } from "$lib/schemas/Profile.ts";



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

    static async updateUserProfile(params: any) {
        return ""
    }

    static async createNewProfile(userId: string) {
        try {

            const response = await fetch(`${PUBLIC_URL}/api/profile/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: userId })
            })

            const data = await response.json();
            return data;
        }
        catch(error) {
            throw new Error(`Failed to create user profile: ${error}`)
        }
    }
}

export default ProfileClient