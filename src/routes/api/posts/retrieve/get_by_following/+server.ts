import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { and, count, eq, inArray, sql } from 'drizzle-orm';
import { postPageLimit } from '../retrieval.config.ts';
import { auth } from '$lib/auth.ts';
import { isLikedSubquery, orderBySort } from '$lib/subqueries/PostsQueries.ts';
import ImageService from '$lib/server/ImageService.ts';
import type { ImageWithUrl } from '$lib/@types/IImage.ts';
import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';



export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const pageParam = url.searchParams.get('page');
        const orderBy = url.searchParams.get('orderBy')

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        if (!userId) {
            throw new Error("User must be logged in to get followers")
        }

        const page = Number(pageParam)
        const offset = (page - 1) * postPageLimit;

        if (isNaN(page) || page < 1) {
            return new Response(JSON.stringify({ error: "Failed to get page paramter for pagination." }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }



        const following: { recieverId: string }[] = await DrizzleDB.query.followers.findMany({
            where: (followers, { eq }) => eq(followers.senderId, userId),
            columns: {
                recieverId: true
            }
        })

        const followedUserIds = following.map(f => f.recieverId)


        const postData = await DrizzleDB.query.posts.findMany({
            where: (posts, { eq }) => and(eq(posts.isDeleted, false), inArray(posts.userId, followedUserIds)),
            extras: {
                likeCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM likes 
                    WHERE likes.object_id = posts.id
                )`.as('like_count'),
                commentCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM comments
                    WHERE comments.post_id = posts.id
                    AND comments.is_deleted = false
                )`.as('comment_count'),
                isLiked: isLikedSubquery(userId).as('is_liked')
            },
            with: {
                user: true,
            },
            limit: postPageLimit,
            offset: offset,
            orderBy: orderBySort(orderBy)
        });

        /**
         * Getting the total number of posts from the database.
         * This is so that way the number of pages for pagination can
         * be calculated.
        */
        const [{ count: totalCount }] = await DrizzleDB
            .select({ count: count() })
            .from(posts)
            .where(and(eq(posts.isDeleted, false), inArray(posts.userId, followedUserIds)));

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