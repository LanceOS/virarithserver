import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { postPageLimit } from '../../../../../lib/retrieval.config.ts';
import { posts } from '$lib/schemas/Posts.ts';
import { likes } from '$lib/schemas/Likes.ts'; 
import ImageService from '$lib/server/ImageService.ts';
import { user } from '$lib/schemas/authentication.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import { isPostLikedSubquery } from '$lib/subqueries/PostsQueries.ts';
import { isCommentReportedSubquery } from '$lib/subqueries/CommentQueries.ts';


export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url)
        const userIdParam = url.searchParams.get("userId");
        const pageParam = url.searchParams.get("page");

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const currentUserId: string | null = session?.user.id || null; 

        if (!userIdParam) {
            return new Response(JSON.stringify({ error: "Missing user ID for post retrieval!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const page = Number(pageParam)
        const offset = (page - 1) * postPageLimit;

        const postData = await DrizzleDB.select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            userId: posts.userId,
            category: posts.category,
            type: posts.type,
            user: user,
            isEdited: posts.isEdited,
            isDeleted: posts.isDeleted,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            likeCount: sql<number>`(
                SELECT COUNT(*)::int
                FROM likes
                WHERE likes.object_id = posts.id
                AND likes.object_type = 'post'
            )`.as('like_count'),
            commentCount: sql<number>`(
                SELECT COUNT(*)::int
                FROM comments
                WHERE comments.post_id = posts.id
                AND comments.is_deleted = false
            )`.as('comment_count'),
            isLiked: isPostLikedSubquery(currentUserId).as('is_liked'),
            isReported: isCommentReportedSubquery(currentUserId).as('is_reported')
        })
        .from(posts)
        .innerJoin(user, eq(posts.userId, user.id))
        .innerJoin(likes, eq(posts.id, likes.objectId))
        .where(
            and(
                eq(posts.isDeleted, false),
                eq(likes.userId, userIdParam), 
                eq(likes.objectType, 'post')  
            )
        )
        .limit(postPageLimit)
        .offset(offset)
        .orderBy(desc(posts.createdAt)); 

        /**
         * Getting the total number of liked posts for pagination.
         */
        const [{ count: totalCount }] = await DrizzleDB
            .select({ count: count() })
            .from(posts)
            .innerJoin(likes, eq(posts.id, likes.objectId))
            .where(
                and(
                    eq(posts.isDeleted, false),
                    eq(likes.userId, userIdParam),
                    eq(likes.objectType, 'post')
                )
            );

        const totalPages = Math.ceil(Number(totalCount) / postPageLimit);

        const images = await ImageService.getS3Objects(postData);
        const conformedPostData = Generalizer.serializedPostDataAndAlignImages(postData, images);


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
        return new Response(JSON.stringify({ message: "Failed to fetch liked posts", error: (error instanceof Error ? error.message : String(error)) }), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}