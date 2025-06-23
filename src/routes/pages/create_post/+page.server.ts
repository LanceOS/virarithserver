import { fail, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/auth.ts';
import type { PostSchema } from '$lib/schemas/Posts.ts';
import S3Service from '$lib/server/S3Service.ts';
import PostService from '$lib/server/PostService.ts';
import type { PageServerLoad } from './$types.js';
import CategoryClient from '$lib/tools/CategoryClient.ts';
import type { TopicSchema } from '$lib/schemas/Topic.ts';



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
      const files = data.getAll('file') as File[];

      const session = await auth.api.getSession({
        headers: request.headers
      });

      if (!session?.user) {
        console.log("failed")
        return fail(400, { session, missing: true });
      };

      const post: PostSchema = {
        title: data.get("title") as string,
        content: data.get("content") as string,
        category: data.get("category") as string,
        type: "post",
        userId: session.user.id
      }

      const postData = await PostService.createPost(post);

      let validFiles: File[] = [];
      let imageIds: string[] = [];


      if (files.length > 0) {
        const object = postData[0];
        console.log(files)
        validFiles = files.filter(file => file instanceof File && file.size > 0);
        imageIds = await S3Service.uploadImages(validFiles, object, fetch);
        console.log("Successful ids", imageIds)
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