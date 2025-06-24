import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import UserService from "$lib/server/UserService.ts";


export const load: PageServerLoad = async ({ request }) => {
    try {
        const staff = await UserService.getStaffUsers()

        return {
            staff: staff
        }
    }
    catch(error) {
        return fail(500, {
            message: `Failed to get data for page ${error}`,
            error: true,
            details: error instanceof Error ? error.message : String(error)
          });    }
}