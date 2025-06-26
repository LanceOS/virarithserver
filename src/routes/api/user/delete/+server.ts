import { authClient } from '$lib/auth-client.ts'
import { auth } from '$lib/auth.ts'
import { DrizzleDB } from '$lib/Drizzle.ts'
import { user } from '$lib/schemas/authentication.ts'
import { commentReply } from '$lib/schemas/CommentReply.ts'
import { comments } from '$lib/schemas/Comments.ts'
import { images } from '$lib/schemas/Images.ts'
import { posts } from '$lib/schemas/Posts.ts'
import { profile } from '$lib/schemas/Profile.ts'
import { and, eq } from 'drizzle-orm'



export const DELETE = async ({ request }) => {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if(!session?.user) {
            throw new Error("User must be logged in to delete post.")
        }

        const currentUser = session.user;        

        await DrizzleDB.transaction(async (tx) => {
            await tx.update(posts).set({ userId: "ghost" }).where(eq(posts.userId, currentUser.id)).execute();
            await tx.update(comments).set({ userId: "ghost" }).where(eq(comments.userId, currentUser.id)).execute();
            await tx.update(commentReply).set({ userId: "ghost" }).where(eq(commentReply.userId, currentUser.id)).execute();
            await tx.update(images).set({ userId: "ghost" }).where(eq(images.userId, currentUser.id))
        })

        await DrizzleDB.transaction(async (tx) => {
            await tx.delete(profile).where(eq(profile.userId, currentUser.id)).execute();
            await tx.delete(user).where(and(eq(user.id, currentUser.id), eq(user.email, currentUser.email))).execute();
        })

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error: unknown) {
        console.error("Error during user deletion:", error);
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}