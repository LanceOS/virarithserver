import { PUBLIC_URL } from '$env/static/public';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { profile, type ProfileSchema } from '$lib/schemas/Profile.ts';
import { and, eq } from 'drizzle-orm';



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

    static async updateUserProfile(body: ProfileSchema): Promise<ProfileSchema> {
        try {
            if (!body.id || !body.userId || !body) {
                throw new Error(`Post information was not provided ${body}`);
            }

            console.log("Getting body from the server:", body)
            const response = await DrizzleDB.update(profile).set({
                bio: body.bio,
                minecraftName: body.minecraftName,
                discordName: body.discordName
            })
            .where(and(eq(profile.id, body.id), eq(profile.userId, body.userId)))
            .returning()
    
            if (response.length === 0) {
                throw new Error(`Failed to update profile. It may not exist or you may not have permission.`);
            }

            console.log(response.length)
    
            return response[0];
        }
        catch(error) {
            throw new Error(error)
        }
    }

}

export default ProfileClient