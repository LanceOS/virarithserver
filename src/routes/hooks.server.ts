import { auth } from "$lib/auth.ts";// path to your auth file
import { svelteKitHandler } from "better-auth/svelte-kit";
 
export async function handle({ event, resolve }: any) {
    return svelteKitHandler({ event, resolve, auth });
}

