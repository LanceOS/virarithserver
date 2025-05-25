import PostClient from "$lib/tools/PostClient.ts";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ url }) => {
    try {

        const posts = await PostClient.getAllPosts({ page: 1 });
        return {
            posts
        };
    } catch (error) {
        console.error('Error fetching posts in load function:', error);
        return {
            posts: [],
            error: 'Failed to load posts. Please try again later.'
        };
    }
};