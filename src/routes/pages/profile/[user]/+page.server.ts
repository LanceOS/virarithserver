import type { PostWithImage } from "$lib/@types/IPostSerializer.ts";
import PostClient from "$lib/tools/PostClient.ts";
import ProfileClient from "$lib/tools/ProfileClient.ts";
import type { PageServerLoad } from "../$types.js";

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
    catch(error) {
        console.error(error)
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL"
        })
    }
}