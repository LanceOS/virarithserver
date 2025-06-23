import { fail, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/auth.ts';
import ImageService from '$lib/server/ImageService.ts';
import PostService from '$lib/server/PostService.ts';
import S3Service from '$lib/server/S3Service.ts';
import type { TopicSchema } from '$lib/schemas/Topic.ts';
import CategoryClient from '$lib/tools/CategoryClient.ts';
import type { PageServerLoad } from '../$types.js';


export const load: PageServerLoad = async ({ request }) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers
      });
      if(!session) {
        return;
      };
  
      const user = session.user;
  
      const response: TopicSchema[] = await CategoryClient.getCategories();
      const filteredCategories: string[] = [];
  
      for (let i = 0; i < response.length; i++) {
        const topic = response[i].topic.trim().toLowerCase();
  
        if (user.role === 'user' && (topic === 'updates' || topic === 'announcements')) {
          continue;
        }
        if (topic === 'all') {
          continue;
        }
  
        filteredCategories.push(response[i].topic);
      }
  
      return {
        categories: filteredCategories
      }
  
    }
    catch(error) {
      return fail(500, {
        message: `Failed to upload data ${error.message}`,
        error: true,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }


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

            await PostService.updatePost(updatedPost)

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

            let currentPostImagesInDatabase = await ImageService.getDrizzleImageObjects(updatedPost);

            if (currentPostImagesInDatabase && parsedExistingImagesFromClient.length > 0) {
                const imagesToDelete = currentPostImagesInDatabase.filter((img) =>
                    !parsedExistingImagesFromClient.some((clientImage: { id: string }) => clientImage.id === img.id)
                );

                if (imagesToDelete.length > 0) {
                    const s3DeleteResponse = await S3Service.deleteImages(imagesToDelete);
                    const drizzleRemoveResponse = await ImageService.removeDrizzleS3Objects(imagesToDelete);
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
                const imageIds = await S3Service.uploadImages(validFiles, updatedPost, fetch);
                console.log(imageIds)
            }

            if (parsedExistingImagesFromClient.length === 0 && currentPostImagesInDatabase.length > 0) {
                const s3DeleteResponse = await S3Service.deleteImages(currentPostImagesInDatabase);
                const drizzleRemoveResponse = await ImageService.removeDrizzleS3Objects(currentPostImagesInDatabase);

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