import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/auth.ts'; // Adjust this path to your actual auth.ts file

// This file handles ALL HTTP methods (GET, POST, PUT, DELETE, etc.)
// that Better Auth might need. The [...all] syntax catches any sub-path.

export async function GET(event) {
    // The svelteKitHandler processes the request and returns the appropriate response
    // based on the Better Auth configuration.
    return svelteKitHandler({ event, auth });
}

export async function POST(event) {
    return svelteKitHandler({ event, auth });
}

export async function PUT(event) {
    return svelteKitHandler({ event, auth });
}

export async function DELETE(event) {
    return svelteKitHandler({ event, auth });
}

export async function PATCH(event) {
    return svelteKitHandler({ event, auth });
}

export async function HEAD(event) {
    return svelteKitHandler({ event, auth });
}

export async function OPTIONS(event) {
    return svelteKitHandler({ event, auth });
}