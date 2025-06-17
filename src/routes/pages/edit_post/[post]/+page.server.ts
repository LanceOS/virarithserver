

import { fail, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/auth.ts';
import ImageClient from '$lib/tools/ImageClient.ts';
import S3Client from '$lib/tools/S3Client.ts';


export const actions: Actions = {
    submitData: async ({ request, fetch }) => {
        try {
            const data = await request.formData();

            const session = await auth.api.getSession({
                headers: request.headers
            });

            if (!session?.user) {
                console.log("failed")
                return fail(400, { session, missing: true });
            };


            const updatedPost = { ...JSON.parse(data.get("post") as string), userId: session.user.id };

            if (!updatedPost) {
                return fail(400, { success: false, message: "missing form data" })
            }

            const existingImagesFromClient = data.getAll("existingImages") as string[];
            const parsedExistingImagesFromClient = existingImagesFromClient
                .map(img => {
                    try {
                        return JSON.parse(img);
                    } catch (e) {
                        console.error("Failed to parse existing image JSON:", img, e);
                        return null;
                    }
                })
                .filter(Boolean);

            let currentPostImagesInDatabase = await ImageClient.getDrizzleImageObjects(updatedPost);

            if (currentPostImagesInDatabase && parsedExistingImagesFromClient.length > 0) {
                const imagesToDelete = currentPostImagesInDatabase.filter((img) =>
                    !parsedExistingImagesFromClient.some((clientImage: { id: string }) => clientImage.id === img.id)
                );

                if (imagesToDelete.length > 0) {
                    const s3DeleteResponse = await S3Client.deleteImages(imagesToDelete);
                    const drizzleRemoveResponse = await ImageClient.removeDrizzleS3Objects(imagesToDelete);
                    if (s3DeleteResponse === true) {
                        console.log({ success: true })
                    }

                    if (drizzleRemoveResponse === true) {
                        console.log({ success: true })
                    }

                }

                currentPostImagesInDatabase = currentPostImagesInDatabase.filter(img => {
                    return !imagesToDelete.some(deletedImg => deletedImg.id === img.id);
                });
            }

            const newImagesFromClient = data.getAll("newImages") as File[];

            if (currentPostImagesInDatabase.length < 3 && newImagesFromClient.length > 0) {
                const validFiles = newImagesFromClient.filter(file => file instanceof File && file.size > 0);
                const imageIds = await S3Client.uploadImages(validFiles, updatedPost, fetch);
                console.log(imageIds)
            }

            if (parsedExistingImagesFromClient.length === 0 && currentPostImagesInDatabase.length > 0) {
                const s3DeleteResponse = await S3Client.deleteImages(currentPostImagesInDatabase);
                const drizzleRemoveResponse = await ImageClient.removeDrizzleS3Objects(currentPostImagesInDatabase);

                if (s3DeleteResponse === true) {
                    console.log({ success: true })
                }

                if (drizzleRemoveResponse === true) {
                    console.log({ success: true })
                }
            }



            await new Promise(resolve => setTimeout(resolve, 500));

            return { success: true, message: 'Form submitted successfully!' };
        }
        catch (error) {
            console.log(error)
            return fail(500, {
                message: `Failed to upload data ${error.message}`,
                error: true,
                details: error instanceof Error ? error.message : String(error)
            });
        }
    }
}