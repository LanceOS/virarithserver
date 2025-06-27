import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./schemas/authentication.ts"
import { DrizzleDB } from "./Drizzle.ts";
import { PRIVATE_DISCORD_CLIENT, PRIVATE_DISCORD_SECRET, PRIVATE_GOOGLE_CLIENT, PRIVATE_GOOGLE_SECRET } from "$env/static/private";
import ProfileService from "./server/ProfileService.ts";
import { PUBLIC_URL } from "$env/static/public";

export const auth = betterAuth({
    database: drizzleAdapter(DrizzleDB, {
        provider: "pg",
        schema: schema
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // Updates after 24 hours of activity
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user"
            }
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        discord: {
            clientId: PRIVATE_DISCORD_CLIENT as string,
            clientSecret: PRIVATE_DISCORD_SECRET as string,
            redirectURI: `${PUBLIC_URL}/api/auth/callback/discord`
        },
        google: {
            clientId: PRIVATE_GOOGLE_CLIENT as string,
            clientSecret: PRIVATE_GOOGLE_SECRET as string,
            redirectURI: `${PUBLIC_URL}/api/auth/callback/google`
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
        max: 100, // Max 100 requests
    },
    basePath: "/api/auth",
    trustedOrigins: [`${PUBLIC_URL}`]
});