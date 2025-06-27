import UserService from "$lib/server/UserService.ts";
import type { PageServerLoad } from "./$types.js";


export const load: PageServerLoad = async ({ params }) => {
    try {
        const userId = params.user;

        const notifications = await UserService.getUserNotification(userId)
        return {
            notifications: notifications
        }
    }
    catch (error) {
        return {
            message: `Failed to upload data ${error}`,
            error: true,
            details: error instanceof Error ? error.message : String(error)
        };
    }
}