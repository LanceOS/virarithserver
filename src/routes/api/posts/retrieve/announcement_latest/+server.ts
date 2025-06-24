import { DrizzleDB } from '$lib/Drizzle.ts';
import { and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { auth } from '$lib/auth.ts';
import { isLikedSubquery } from '$lib/subqueries/PostsQueries.ts';
import ImageService from '$lib/server/ImageService.ts';
import type { ImageWithUrl } from '$lib/@types/IImage.ts';
import type { PostWithImage } from '$lib/@types/IPostSerializer.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';




export const GET = async ({ request }): Promise<Response> => {
    try {
        const category = "announcements"

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        const postData = await DrizzleDB.query.posts.findFirst({
            where: (posts, { eq }) => and(
                eq(posts.category, category),
                eq(posts.isDeleted, false)
            ),
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
            orderBy: (posts, { desc }) => [desc(posts.createdAt)]
        });

        if(!postData) {
            throw new Error(`Failed to get lastest announcement post: ${postData}`)
        }
        
        const images: ImageWithUrl[] = await ImageService.getS3Objects(postData);
        const conformedPostData: PostWithImage | PostWithImage[] = Generalizer.serializedPostDataAndAlignImages(postData, images)

        return new Response(JSON.stringify(conformedPostData), {
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