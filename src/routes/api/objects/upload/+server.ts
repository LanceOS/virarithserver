import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { images, type ImageSchema } from '$lib/schemas/Images.ts';
import { uploadFile } from '$lib/server/MinIOServer.server.ts';

export const POST = async ({ request }) => {
    try {
        const formData = await request.formData();

        console.log("In backend", formData)
        const file = formData.get('file') as File | null;

        /**
         * Object refers to the post, comment, comment reply, and user objects.
         */
        const objectId = formData.get('objectId') as string;
        const objectType = formData.get("objectType") as string;


        if (!file) {
            return new Response(JSON.stringify({ error: "A file must be provided!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }
        if(!objectId || !objectType) {
            return new Response(JSON.stringify({ error: "Missing required object information for upload!" }), {
                status: 400,
                statusText: "BAD REQUEST"
            })
        }

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        if(!userId) {
            return new Response(JSON.stringify({ error: "User must be logged in!"}), {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        };

        const fileId = await uploadFile(file);

        const schemaValues: ImageSchema = {
            bucketObjectId: fileId,
            objectId: objectId,
            objectType: objectType,
            userId: userId
        };

        const newImage = await DrizzleDB.insert(images).values(schemaValues).returning();
        

        return new Response(JSON.stringify({
            bucketId: fileId,
            drizzleId: newImage[0].id
        }), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })

    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
};