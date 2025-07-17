import type { PageServerLoad } from "./$types.js";
import UserService from "$lib/server/UserServer.server.ts";


export const load: PageServerLoad = async ({ request }) => {
    try {
        const staff = await UserService.getStaffUsers()

        if(!staff) {
            return;
        }

        return {
            staff: staff
        }
    }
    catch(error) {
        console.error(error)
        return []
    }
}