import { auth } from '$lib/auth.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { user } from '$lib/server/schemas/authentication.ts';
import { eq } from 'drizzle-orm';

export const PUT = async ({ request }) => {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user || session.user.role === 'user') {
			return new Response(
				JSON.stringify({ error: 'User must be logged in and have an administrative role.' }),
				{
					status: 403,
					statusText: 'UNAUTHORIZED',
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const userToChange = await request.json();

		if (!userToChange.id || !userToChange.newRole) {
			return new Response(JSON.stringify({ error: 'User ID and new role are required.' }), {
				status: 400,
				statusText: 'BAD REQUEST',
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const response = await DrizzleDB.update(user)
			.set({
				role: userToChange.newRole
			})
			.where(eq(user.id, userToChange.id))
			.execute();

		console.log(response);

		return new Response(
			JSON.stringify({
				message: `User role for ID ${userToChange.id} updated successfully to ${userToChange.newRole}.`
			}),
			{
				status: 200,
				statusText: 'OK',
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			statusText: 'FAIL',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
