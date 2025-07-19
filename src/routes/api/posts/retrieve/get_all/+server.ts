import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts } from '$lib/server/schemas/Posts.ts';
import { count, eq } from 'drizzle-orm';
import { postPageLimit } from '../../../../../lib/retrieval.config.ts';
import { auth } from '$lib/auth.ts';
import ImageService from '$lib/server/tools/ImageServer.server.ts';
import type { ImageWithUrl } from '$lib/@types/IImage.ts';
import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import PostServer from '$lib/server/tools/PostServer.server.ts';



export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const pageParam = url.searchParams.get('page');
        const orderByParam = url.searchParams.get('orderBy')

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        const page = Number(pageParam)
        const offset = (page - 1) * postPageLimit;

        if (isNaN(page) || page < 1) {
            return new Response(JSON.stringify({ error: "Failed to get page parameter for pagination."}), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }



        /**
         * @returns all posts with a user
         */

        const postData = await PostServer.getAllPosts({ page: page, orderBy: orderByParam, userId: userId, pageOffset: offset })

        /**
         * Getting the total number of posts from the database.
         * This is so that way the number of pages for pagination can
         * be calculated.
        */
        const [{ count: totalCount }] = await DrizzleDB
            .select({ count: count() })
            .from(posts)
            .where(eq(posts.isDeleted, false));

        const totalPages = Math.ceil(Number(totalCount) / postPageLimit);

        const images: ImageWithUrl[] = await ImageService.getS3Objects(postData);
        const conformedPostData: PostWithImage | PostWithImage[] = Generalizer.serializedPostDataAndAlignImages(postData, images)

        return new Response(JSON.stringify({
            posts: conformedPostData,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrevious: page > 1
            }
        }), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error) {
        return new Response(JSON.stringify(error), {
            status: 404,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}