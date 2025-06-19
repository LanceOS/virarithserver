import PostClient from "$lib/tools/PostClient.ts";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types.js";
import { auth } from "$lib/auth.ts";
import ProfileService from "$lib/server/ProfileService.ts";
import ProfileClient from "$lib/tools/ProfileClient.ts";
import CommentClient from "$lib/tools/CommentClient.ts";
import LikeClient from "$lib/tools/LikeClient.ts";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const userId = params.user;

        const [profile, posts, comments, likes] = await Promise.all([
            ProfileClient.getUserProfile(userId),
            PostClient.getPostsByUser({ userId: userId, page: 1 }),
            CommentClient.getCommentsByUser({ userId: userId, page: 1 }),
            LikeClient.getLikesByUser({ userId: userId, page: 1 })
        ]);
        
        return {
            profile,
            posts,
            comments,
            likes
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

            const response = await ProfileService.updateUserProfile({ ...profile, userId: session.user.id})
            

            console.log("Returning response from drizzle:", response)
            await new Promise(resolve => setTimeout(resolve, 500));

            return { success: true }
        }
        catch (error) {
            return fail(500, { success: false, message: error.message })
        }
    }
}