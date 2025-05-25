import PostClient from '$lib/tools/PostClient.ts';
import type { PageServerLoad } from './$types.js';


export const load: PageServerLoad = async ({ params }) => {
    try {
        const post = params.post

        if(!post) {
            throw new Error("Post id required")
        }

        const posts = await PostClient.getPostById(post);

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