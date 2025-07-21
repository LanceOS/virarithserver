import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from './server/schemas/authentication.ts';
import { DrizzleDB } from './Drizzle.ts';
import {
	PRIVATE_DISCORD_CLIENT,
	PRIVATE_DISCORD_SECRET,
	PRIVATE_GOOGLE_CLIENT,
	PRIVATE_GOOGLE_SECRET
} from '$env/static/private';
import ProfileService from './server/tools/ProfileServer.server.ts';
import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public';
import { eq, sql } from 'drizzle-orm';
import { banned } from './server/schemas/Banned.ts';

export const auth = betterAuth({
	database: drizzleAdapter(DrizzleDB, {
		provider: 'pg',
		schema: schema
	}),
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // Updates after 24 hours of activity
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				defaultValue: 'user'
			}
		},
		hooks: {
			beforeCreate: async (ctx) => {
				const email = ctx.input.email; 
				if (email) {
					const bannedUser = await DrizzleDB
						.select()
						.from(banned)
						.where(eq(sql`lower(${banned.email})`, email.toLowerCase()))
						.execute();

					if (bannedUser.length > 0) {
						throw new Error('This email address has been banned.');
					}
				}
				return ctx.input;
			},
			beforeSignIn: async (ctx) => {
				const user = ctx.user;
				if (user && user.email) {
					const bannedUser = await DrizzleDB
						.select()
						.from(banned)
						.where(eq(sql`lower(${banned.email})`, user.email.toLowerCase()))
						.execute();

					if (bannedUser.length > 0) {
						throw new Error('This account has been banned.');
					}
				}
				return ctx.input;
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: false
	},
	socialProviders: {
		discord: {
			clientId: PRIVATE_DISCORD_CLIENT as string,
			clientSecret: PRIVATE_DISCORD_SECRET as string
		},
		google: {
			clientId: PRIVATE_GOOGLE_CLIENT as string,
			clientSecret: PRIVATE_GOOGLE_SECRET as string
		}
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user, ctx) => {
					await ProfileService.createNewProfile({ userId: user.id });
				}
			}
		}
	},
	rateLimit: {
		window: 10, // 10-second window
		max: 100 // Max 100 requests
	},
	basePath: '/api/auth',
	trustedOrigins: [`${PUBLIC_BETTER_AUTH_URL}`]
});
