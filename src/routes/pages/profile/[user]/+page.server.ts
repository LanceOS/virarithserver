import type { PostWithImage } from "$lib/@types/IPostSerializer.ts";
import PostClient from "$lib/tools/PostClient.ts";
import ProfileClient from "$lib/tools/ProfileClient.ts";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types.js";
import { auth } from "$lib/auth.ts";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const userId = params.user;

        const profile = await ProfileClient.getUserProfile(userId);
        const posts: PostWithImage = await PostClient.getPostsByUser({ userId: userId, page: 1 })

        return {
            profile,
            posts
        };
    }
    catch (error) {
        console.error(error)
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL"
        })
    }
}


export const actions: Actions = {
    submitEditedProfile: async ({ request }) => {
        try {
            const data = await request.formData();
            const profile = JSON.parse(data.get("profile") as string);

            const session = await auth.api.getSession({
                headers: request.headers
            })
            if(!session?.user) {
                throw new Error(`User must be logged in to edit post. User: ${session?.user}`);            }

            const response = await ProfileClient.updateUserProfile({ ...profile, userId: session.user.id})
            

            console.log("Returning response from drizzle:", response)
            await new Promise(resolve => setTimeout(resolve, 500));

            return { success: true }
        }
        catch (error) {
            return fail(500, { success: false, message: error.message })
        }
    }
}