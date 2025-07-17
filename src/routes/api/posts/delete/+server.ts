import type { PostWithImage } from '$lib/@types/IPostSerializer.ts'
import { auth } from '$lib/auth.ts'
import { DrizzleDB } from '$lib/Drizzle.ts'
import { commentReply } from '$lib/schemas/CommentReply.ts'
import { comments } from '$lib/schemas/Comments.ts'
import { images } from '$lib/schemas/Images.ts'
import { notifications } from '$lib/schemas/Notifications.ts'
import { posts } from '$lib/schemas/Posts.ts'
import ImageService from '$lib/server/ImageServer.server.ts'
import S3Service from '$lib/server/S3Server.server.ts'
import { and, eq, inArray } from 'drizzle-orm'

/**
 * Handles the deletion process for a post, its comments, comment replies,
 * associated images, and notifications. This is a SvelteKit endpoint handler.
 *
 * @description
 * This endpoint performs a **soft delete** for the main post, its comments, and comment replies
 * by setting their `isDeleted` flag to `true` in the database.
 * Conversely, it performs a **hard delete** for all related images (both database records and
 * files in S3) and all associated notifications, which are permanently removed.
 * All database operations are wrapped in a Drizzle transaction to ensure data consistency.
 *
 * @param {object} request - The SvelteKit `Request` object.
 * The request body must be a JSON object representing the `PostSchema`
 * (containing `id` and `type` of the post).
 * The `request.headers` are used to extract the user session for authentication.
 *
 * @returns {Promise<Response>} A Promise that resolves to a `Response` object.
 * - **Success (HTTP 200 OK):** Returns a JSON object `{ success: true, postId: string }`.
 * - **Error (HTTP 500 FAIL):** Returns a JSON object containing the error details.
 */
export const PUT = async ({ request }) => {
    try {
        const post: PostWithImage = await request.json()

        if (!post.id || !post.type) {
            return new Response(JSON.stringify({ error: "Missing required post data for deletion!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        if (!userId) {
            return new Response(JSON.stringify({ error: "User must be logged in!" }), {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        }

        const drizzleImagesForPosts = await ImageService.getDrizzleImageObjects(post)

        await DrizzleDB.transaction(async (tx) => {

            let commentIds: string[] = [];
            if (post.commentCount > 0) {
                // First grabbing the post comments ids
                const postComments = await tx.select({ id: comments.id })
                    .from(comments)
                    .where(eq(comments.postId, post.id!))
                    .execute();
                // This transforms the returns objects into strings
                commentIds = postComments.map(cr => cr.id);
            }

            // Defining the possible comment reply ids
            let commentReplyIds: string[] = [];
            if (commentIds.length > 0) {
                // Grabbing the comment reply ids
                const replies = await tx.select({ id: commentReply.id })
                    .from(commentReply)
                    .where(inArray(commentReply.parentComment, commentIds))
                    .execute();
                commentReplyIds = replies.map(cr => cr.id);
            }

            // Soft deleting the posts and comments and comment replies
            await tx.update(posts).set({ isDeleted: true }).where(and(eq(posts.id, post.id!), eq(posts.userId, userId))).execute();
            await tx.update(comments).set({ isDeleted: true }).where(eq(comments.postId, post.id!)).execute();
            await tx.update(commentReply).set({ isDeleted: true }).where(eq(commentReply.postId, post.id!)).execute();

            // Deleting the images that are associated with the posts
            await tx.delete(images).where(and(eq(images.objectId, post.id!), eq(images.objectType, post.type!), eq(images.userId, userId)))

            // Creating an array with all of the ids that are going to be required for deleting notifications
            const allObjectIdsToDeleteNotificationsFor = [post.id!, ...commentIds, ...commentReplyIds];

            // Deleting all notifications from the database that could be associated with this post
            await tx.delete(notifications).where(inArray(notifications.objectId, allObjectIdsToDeleteNotificationsFor)).execute();
        })

        await S3Service.deleteImages(drizzleImagesForPosts)



        return new Response(JSON.stringify({ success: true, postId: post.id }), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error: unknown) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}