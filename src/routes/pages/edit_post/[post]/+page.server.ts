

import PostClient from '$lib/tools/PostClient.ts';
import { fail, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/auth.ts';
import type { PostSchema } from '$lib/schemas/Posts.ts';
import S3Client from '$lib/tools/S3Client.ts';

export const actions: Actions = {
  submitData: async ({ request, fetch }) => {
    try {
      const data = await request.formData();
      const files = data.getAll('file') as File[];

      const session = await auth.api.getSession({
        headers: request.headers
      });

      if(!session?.user) {
        console.log("failed")
        return fail(400, { session, missing: true });
      };

      const post: PostSchema = {
        title: data.get("title") as string,
        content: data.get("content") as string,
        category: data.get("category") as string,
        userId: session.user.id
      }

      const postData = await PostClient.updatePost(post);
      
      if(postData.name && postData.name.toLowerCase() === 'error') {
        console.log(postData)
      }

      let validFiles: File[] = [];
      let imageIds: string[] = [];


      if(files.length > 0) {
        const object = postData[0];
          console.log(files)
          validFiles = files.filter(file => file instanceof File && file.size > 0);
          imageIds = await S3Client.uploadImages(validFiles, object, fetch);
          console.log("Successful ids", imageIds)
      }
  
  
  
      await new Promise(resolve => setTimeout(resolve, 500));
  
      return { success: true, message: 'Form submitted successfully!' };
    }
    catch(error) {
      console.log(error)
      return fail(500, {
        message: `Failed to upload data ${error.message}`,
        error: true,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
}