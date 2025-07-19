import { auth } from '$lib/auth.ts'
import { DrizzleDB } from '$lib/Drizzle.ts'
import { user } from '$lib/server/schemas/authentication.ts'
import { commentReply } from '$lib/server/schemas/CommentReply.ts'
import { comments } from '$lib/server/schemas/Comments.ts'
import { followers } from '$lib/server/schemas/Followers.ts'
import { images } from '$lib/server/schemas/Images.ts'
import { notifications } from '$lib/server/schemas/Notifications.ts'
import { posts } from '$lib/server/schemas/Posts.ts'
import { profile } from '$lib/server/schemas/Profile.ts'
import { and, eq } from 'drizzle-orm'



export const DELETE = async ({ request }) => {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if(!session?.user) {
            return new Response(JSON.stringify({ error: "User must be logged in!"}), {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        }

        const currentUser = session.user;        

        await DrizzleDB.transaction(async (tx) => {
            await tx.update(posts).set({ userId: "ghost" }).where(eq(posts.userId, currentUser.id)).execute();
            await tx.update(comments).set({ userId: "ghost" }).where(eq(comments.userId, currentUser.id)).execute();
            await tx.update(commentReply).set({ userId: "ghost" }).where(eq(commentReply.userId, currentUser.id)).execute();
            await tx.update(images).set({ userId: "ghost" }).where(eq(images.userId, currentUser.id)).execute();
        })

        await DrizzleDB.transaction(async (tx) => {
            await tx.delete(followers).where(eq(followers.senderId, currentUser.id)).execute();
            await tx.delete(notifications).where(eq(notifications.senderId, currentUser.id)).execute();
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