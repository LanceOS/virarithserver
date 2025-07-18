import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/svelte"
import type { auth } from './auth.ts';
import { PUBLIC_BETTER_AUTH_URL } from "$env/static/public";


export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: `${PUBLIC_BETTER_AUTH_URL}/api/auth`,
    plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],
})


export const { signIn, signUp, useSession, getSession } = createAuthClient();

export type Session = typeof authClient.$Infer.Session
