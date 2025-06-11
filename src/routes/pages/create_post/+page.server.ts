import S3Client from '$lib/tools/S3Client.ts';
import { type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  submitData: async ({ request, fetch }) => {
    const data = await request.formData();
    const files = data.getAll('file') as File[];

    

    let validFiles: File[] = [];
    let imageIds: string[] = []

    if(files) {
        validFiles = files.filter(file => file instanceof File && file.size > 0);
        imageIds = await S3Client.uploadImages(validFiles, fetch);
        console.log(imageIds)
    }



    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, message: 'Form submitted successfully!' };
  }
}