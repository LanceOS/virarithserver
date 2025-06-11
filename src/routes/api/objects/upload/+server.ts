import { DrizzleDB } from '$lib/Drizzle.ts';
import { uploadFile } from '$lib/server/MinIO.ts';

export const POST = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        if (!file) {
            throw new Error("No file provided");
        }
        const fileId = await uploadFile(file);

        
        

        return new Response(fileId, {
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