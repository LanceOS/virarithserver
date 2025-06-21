import { auth } from '$lib/auth.ts'
import { DrizzleDB } from '$lib/Drizzle.ts'
import { commentReply } from '$lib/schemas/CommentReply.ts'
import { comments } from '$lib/schemas/Comments.ts'
import { images } from '$lib/schemas/Images.ts'
import { posts, type PostSchema } from '$lib/schemas/Posts.ts'
import ImageService from '$lib/server/ImageService.ts'
import S3Service from '$lib/server/S3Service.ts'
import { and, eq } from 'drizzle-orm'

/**
 * 
 * @param postId
 * @param userId
 * @note This performs a SOFT DELETE meaning that the data isn't actually removed from the database
 * to hard delete data change this logic to perform a hard delete and changed schemas to perform cascades on deletion. 
 */
export const PUT = async ({ request }) => {
    try {
        const post: PostSchema = await request.json()

        if (!post.id || !post.type) {
            throw new Error("Failed to pass post for deletion")
        }

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        if(!userId) {
            throw new Error("User must be logged in to delete post.")
        }

        const drizzleImagesForPosts  = await ImageService.getDrizzleImageObjects(post)

        await DrizzleDB.transaction(async (tx) => {
            await tx.update(posts).set({ isDeleted: true }).where(and(eq(posts.id, post.id!), eq(posts.userId, userId))).execute();
            await tx.update(comments).set({ isDeleted: true }).where(eq(comments.postId, post.id!)).execute();
            await tx.update(commentReply).set({ isDeleted: true }).where(eq(commentReply.postId, post.id!)).execute();
            await tx.delete(images).where(and(eq(images.objectId, post.id!), eq(images.objectType, post.type!), eq(images.userId, userId)))
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