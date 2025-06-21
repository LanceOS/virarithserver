import { authClient } from "$lib/auth-client.ts";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    createNewUser: async ({ request }) => {
        try {
            const data = await request.formData();
            const email = data.get('email') as string;
            const password = data.get('password') as string;
            const confirmPassword = data.get('confirm') as string;
            const name = data.get('name') as string;

            if (!email || !password || !confirmPassword || !name) {
                console.log(data)
                return fail(400, { errorLog: 'All fields are required!', email, name });
            }
            if (password !== confirmPassword) {
                return fail(400, { errorLog: 'Passwords do not match!', email, name });
            }
            if (password.length < 8) {
                return fail(400, { errorLog: 'Password must be at least 8 characters long!', email, name });
            }

            const response = await authClient.signUp.email({
                name: name,
                email: email,
                password: password,
                image: 'placeholder',
                role: 'user'
            });

            if (!response || !response.data) {
                throw new Error('Failed to create user!');
            }
        }
        catch (error) {
            console.error(error);
            return fail(500, { success: false, message: `Failed to create user's profile: ${error}` })
        }
    }
}