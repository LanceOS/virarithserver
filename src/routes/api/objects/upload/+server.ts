import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { images, type ImageSchema } from '$lib/schemas/Images.ts';
import { uploadFile } from '$lib/server/MinIO.ts';

export const POST = async ({ request }) => {
    try {
        const formData = await request.formData();

        console.log("In backend", formData)
        const file = formData.get('file') as File | null;

        /**
         * Object refers to the post, comment, and comment reply objects.
         */
        const objectId = formData.get('objectId') as string;
        const objectType = formData.get("objectType") as string;


        if (!file) {
            throw new Error("No file provided");
        }
        if(!objectId || !objectType) {
            throw new Error("Missing object values needed for image uplaod.")
        }

        const session = await auth.api.getSession({
            headers: request.headers
        });
        const userId: string | null = session?.user.id || null;

        if(!userId) {
            throw new Error("User must be logged in to upload photos.")
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
        console.error('File upload error:', error);
        return new Response(JSON.stringify(error.message), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
};