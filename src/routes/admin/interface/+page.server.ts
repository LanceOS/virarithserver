import { auth } from "$lib/auth.ts";
import { fail, type Actions } from "@sveltejs/kit";


export const actions: Actions = {
    updateUser: async ({ request }) => {
        try {
            const data = await request.formData()

            const newRole = data.get("newRole");
            const userToBeUpdated = data.get("userId");

            const session = await auth.api.getSession({
                headers: request.headers
            })
            if (!session?.user) {
                return fail(403, {
                    success: false,
                    message: "User must be logged in!"
                });
            }
            
            if(session.user.role === "user") {
                return fail(403, {
                    success: false,
                    message: "User does not meet the role requirements to make this kind of request!"
                })
            }
        }
        catch (error: any) {
            return fail(500, {
                success: false,
                message: `Failed to update user due to ${error.message}`
            })
        }
    }
}