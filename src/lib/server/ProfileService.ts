import { DrizzleDB } from '$lib/Drizzle.ts';
import { profile, type ProfileSchema } from '$lib/schemas/Profile.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import { and, eq } from 'drizzle-orm';
class ProfileService {
    instance: ProfileService | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    /**
     * @description A simple function that creates a blank user profile with no user info. This user profile 
     * has no bio or any extra info and is created upon user creation.
     * 
     * Uses {@link DrizzleDB} to create a new profile in Postgres.
     * @param {string} userId The newly created user's id.
     * @returns {Promise<ProfileSchema>} Returns the blank profile.
     * @throws {Error} When required field userId is missing
     */
    static async createNewProfile(userId: ProfileSchema): Promise<ProfileSchema> {
        try {
            if (!userId) {
                throw new Error(`Missing user id to create new profile: ${userId}`)
            }
            const newProfile = await DrizzleDB.insert(profile).values(userId).returning();
            return newProfile[0];
        }
        catch (error) {
            throw new Error(`Failed to create user profile: ${error}`)
        }
    }

    /**
     * @description When the user goes to upload their profile this function is called to update the profile in drizzle. 
     * It takes in the raw new profile data and then serializes it before storing
     * it inside of postgres.
     * 
     * Uses {@link ProfileSchema} to check the body's type and {@link DrizzleDB} to store it in Postgres.
     * @param {ProfileSchema} body - The new profile data the user has entered.
     * @returns {Promise<ProfileSchema>} Returns the new profile data.
     * @throws {Error} When required fields (id, userId) are missing
     */
    static async updateUserProfile(body: ProfileSchema): Promise<ProfileSchema> {
        try {
            if (!body.id || !body.userId) {
                throw new Error(`Post information was not provided ${body}`);
            }

            if (body.bio) {
                body.bio = await Generalizer.serializeRawText(body.bio)
            }
            if (body.minecraftName) {
                body.minecraftName = await Generalizer.serializeRawText(body.minecraftName)
            }
            if (body.discordName) {
                body.discordName = await Generalizer.serializeRawText(body.discordName)
            }


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

            return response[0];
        }
        catch (error) {
            throw new Error(error)
        }
    }

}

export default ProfileService