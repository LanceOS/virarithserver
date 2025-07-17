import { DrizzleDB } from '$lib/Drizzle.ts';
import { profile, type ProfileSchema } from '$lib/schemas/Profile.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import { and, eq } from 'drizzle-orm';

const ProfileService = {
    /**
     * @description A simple function that creates a blank user profile with no user info. This user profile
     * has no bio or any extra info and is created upon user creation.
     *
     * Uses {@link DrizzleDB} to create a new profile in Postgres.
     * @param {ProfileSchema} profileData The newly created user's profile data, including their ID.
     * @returns {Promise<ProfileSchema>} Returns the blank profile.
     * @throws {Error} When required field `userId` within `profileData` is missing.
     */
    createNewProfile: async (profileData: ProfileSchema): Promise<ProfileSchema> => {
        try {
            if (!profileData || !profileData.userId) {
                throw new Error(`Missing required user ID to create new profile. Provided data: ${JSON.stringify(profileData)}`);
            }
            const newProfile = await DrizzleDB.insert(profile).values(profileData).returning();

            if (!newProfile || newProfile.length === 0) {
                throw new Error(`Failed to create new user profile. DrizzleDB response was empty or null for data: ${JSON.stringify(profileData)}`);
            }

            return newProfile[0];
        }
        catch (error) {
            console.error(`Failed to create user profile for data: ${JSON.stringify(profileData)}. Error:`, error);
            throw new Error(`Failed to create user profile.`, { cause: error });
        }
    },

    /**
     * @description When the user goes to upload their profile this function is called to update the profile in drizzle.
     * It takes in the raw new profile data and then serializes it before storing
     * it inside of postgres.
     *
     * Uses {@link ProfileSchema} to check the body's type and {@link DrizzleDB} to store it in Postgres.
     * @param {ProfileSchema} body - The new profile data the user has entered.
     * @returns {Promise<ProfileSchema>} Returns the new profile data.
     * @throws {Error} When required fields (id, userId) are missing or if the update fails.
     */
    updateUserProfile: async (body: ProfileSchema): Promise<ProfileSchema> => {
        try {
            if (!body || !body.id || !body.userId) {
                throw new Error(`Required profile ID or user ID was not provided for update. Provided data: ${JSON.stringify(body)}`);
            }

            const newFields: { bio: string; minecraftName: string; discordName: string } = {
                bio: "",
                minecraftName: "",
                discordName: ""
            };

            if (body.bio) {
                newFields.bio = await Generalizer.serializeRawText(body.bio);
            }
            if (body.minecraftName) {
                newFields.minecraftName = await Generalizer.serializeRawText(body.minecraftName);
            }
            if (body.discordName) {
                newFields.discordName = await Generalizer.serializeRawText(body.discordName);
            }

            const response = await DrizzleDB.update(profile).set({
                bio: newFields.bio,
                minecraftName: newFields.minecraftName,
                discordName: newFields.discordName
            })
            .where(and(eq(profile.id, body.id), eq(profile.userId, body.userId)))
            .returning(); 

            if (response.length === 0) {
                throw new Error(`Failed to update profile. It may not exist or the provided user ID does not match.`);
            }

            return response[0];
        }
        catch (error: unknown) {
            console.error(`Error updating user profile for data: ${JSON.stringify(body)}. Error:`, error);
            throw new Error(`Failed to update profile.`, { cause: error instanceof Error ? error : new Error(String(error)) });
        }
    }
};

export default ProfileService;