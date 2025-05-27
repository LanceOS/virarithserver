import ProfileClient from "$lib/tools/ProfileClient.ts";
import type { PageServerLoad } from "./$types.js";

/**
 * 
 * @param userId
 * @returns Returns the users profile based on the userId
 */
export const load: PageServerLoad = async ({ params }) => {

    try {
        const userId = params.user;

        let profile;

        if(!userId) {
            throw new Error("Must include userId to get profile");
        }

        profile = await ProfileClient.getUserProfile(userId);

        if(!profile) {
            profile = await ProfileClient.createNewProfile(userId)
        }

        return {
            profile
        };
    }
    catch(error) {
        return {
            error: `Failed to load profile: ${error}`
        };
    }
}