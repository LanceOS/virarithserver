import PostClient from '$lib/tools/PostClient.ts';
import type { PageServerLoad } from './$types.js';


export const load: PageServerLoad = async ({ url }) => {
    try {
        const page = Number(url.searchParams.get('page') || 1);

        const params = {
            category: "devlogs",
            page: page
        }

        const posts = await PostClient.getPostsByCategory(params);
        return {
            posts
        };
    } catch (error) {
        return {
            posts: [],
            error: `Failed to load posts: ${error}`
        };
    }
};