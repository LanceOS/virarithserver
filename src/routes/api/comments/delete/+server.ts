import type { SerializedComment } from '$lib/@types/ICommentSerializer.ts'
import { auth } from '$lib/auth.ts'
import { DrizzleDB } from '$lib/Drizzle.ts'
import { commentReply } from '$lib/server/schemas/CommentReply.ts'
import { comments } from '$lib/server/schemas/Comments.ts'
import { notifications } from '$lib/server/schemas/Notifications.ts'
import { and, inArray } from 'drizzle-orm'
import { eq } from 'drizzle-orm'

/**
 * Handles the deletion process for a comment and its associated replies.
 * This function is designed as a SvelteKit endpoint handler.
 *
 * @description
 * This endpoint executes a **soft delete** for the main comment and its direct replies
 * by setting their `isDeleted` flag to `true` in the database.
 * Concurrently, it performs a **hard delete** for all associated notifications related
 * to the comment and its replies, permanently removing them from the database.
 * All database operations are encapsulated within a Drizzle transaction to guarantee data consistency.
 *
 * @param {object} request - The SvelteKit `Request` object.
 * The request body must be a JSON object conforming to `SerializedComment`,
 * which implicitly contains the `id` of the comment to be processed and its `postId`.
 * The `request.headers` are utilized to extract the user session for authentication purposes,
 * ensuring that only the owner of the comment can perform this action.
 *
 * @returns {Promise<Response>} A Promise that resolves to a `Response` object.
 * - **Success (HTTP 200 OK):** Returns a JSON response containing the string `"Success"`.
 * - **Error (HTTP 500 FAIL):** Returns a JSON response containing detailed error information.
 */
export const PUT = async ({ request }) => {
    try {
        const comment: SerializedComment = await request.json()
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!session?.user.id) {
            return new Response(JSON.stringify({ error: "User must be logged in!"}), {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        }
        if (!comment.postId || !comment.id) {
            return new Response(JSON.stringify({ error: "Missing required object information for request!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        await DrizzleDB.transaction(async (tx) => {
            // Grabbing the comment reply ids
            const replies = await tx.select({ id: commentReply.id })
                .from(commentReply)
                .where(eq(commentReply.parentComment, comment.id))
                .execute();

            // This transforms the returns objects into strings
            const commentReplyIds: string[] = replies.map(cr => cr.id);


            await tx.update(comments).set({ isDeleted: true })
                .where(and(eq(comments.postId, comment.postId!),
                    eq(comments.userId, session?.user.id),
                    eq(comments.id, comment.id)))
                .execute();
            await tx.update(commentReply).set({ isDeleted: true }).where(eq(commentReply.parentComment, comment.id!)).execute();

            const allObjectIdsToDeleteNotificationsFor = [comment.id, ...commentReplyIds];
            await tx.delete(notifications).where(inArray(notifications.objectId, allObjectIdsToDeleteNotificationsFor))
        })


        return new Response(JSON.stringify("Success"), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}