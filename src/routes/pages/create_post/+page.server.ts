import { fail, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/auth.ts';
import type { PostSchema } from '$lib/server/schemas/Posts.ts';
import S3Service from '$lib/server/tools/S3Server.server.ts';
import PostServer from '$lib/server/tools/PostServer.server.ts';
import type { PageServerLoad } from './$types.js';
import CategoryClient from '$lib/client/tools/CategoryClient.client.ts';
import type { CategorySchema } from '$lib/server/schemas/Category.ts';



export const load: PageServerLoad = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    if(!session) {
      return;
    };

    const user = session.user;

    const response: CategorySchema[] = await CategoryClient.getCategories();
    const filteredCategories: string[] = [];

    for (let i = 0; i < response.length; i++) {
      const category = response[i].category.trim().toLowerCase();

      if (user.role === 'user' && (category === 'updates' || category === 'announcements')) {
        continue;
      }
      if (category === 'all') {
        continue;
      }

      filteredCategories.push(response[i].category);
    }

    return {
      categories: filteredCategories
    }

  }
  catch(error) {
    console.error(error)
    return {
      message: `Failed to upload data ${error}`,
      error: true,
      details: error instanceof Error ? error.message : String(error)
    };
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

      const postData = await PostServer.createPost(post);

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
        message: `Failed to upload data ${error}`,
        error: true,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
}