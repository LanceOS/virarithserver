import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { user } from '$lib/server/schemas/authentication.ts';
import { uploadFile } from '$lib/server/tools/MinIOServer.server.ts';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export const POST = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return new Response(JSON.stringify({ error: "A file must be provided!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        if (!userId || !session?.user.email) {
            return new Response(JSON.stringify({ errro: "User must be logged in!"}), {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        }

        const fileId = await uploadFile(file);

        await DrizzleDB.update(user)
            .set({ image: fileId, updatedAt: new Date() }) 
            .where(and(eq(user.id, userId), eq(user.email, session?.user.email)));

        return new Response(JSON.stringify({
            bucketId: fileId,
            message: "Avatar uploaded successfully"
        }), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
};