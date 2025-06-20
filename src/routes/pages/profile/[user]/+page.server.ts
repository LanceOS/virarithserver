import { fail, type Actions } from "@sveltejs/kit";
import { auth } from "$lib/auth.ts";
import ProfileService from "$lib/server/ProfileService.ts";
import S3Service from "$lib/server/S3Service.ts";
import UserService from "$lib/server/UserService.ts";



export const actions: Actions = {
    submitEditedProfile: async ({ request, fetch }) => {
        try {
            const data = await request.formData();
            const profile = JSON.parse(data.get("profile") as string);
            const newAvatar = data.get('file') as File;

            const session = await auth.api.getSession({
                headers: request.headers
            })
            if(!session?.user) {
                throw new Error(`User must be logged in to edit post. User: ${session?.user}`);           
            }

            const currentUser = session.user

            await ProfileService.updateUserProfile({ ...profile, userId: currentUser.id })

            if(newAvatar && newAvatar instanceof File && newAvatar.size > 0) {
                if(currentUser.image && currentUser.image !== "placeholder") {
                    await S3Service.deleteImages({ userId: currentUser.id, bucketObjectId: currentUser.image! })
                }
                const imageId = await S3Service.uploadUserAvatar(newAvatar, currentUser.id, fetch)
                await UserService.updateUserImageId(imageId, currentUser.id);
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            return { success: true }
        }
        catch (error) {
            return fail(500, { success: false, message: error })
        }
    }
}