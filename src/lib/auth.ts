import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./schemas/authentication.ts"
import { DrizzleDB } from "./Drizzle.ts";
import { DISCORD_CLIENT, DISCORD_SECRET, GOOGLE_CLIENT, GOOGLE_SECRET } from "$env/static/private";
import ProfileService from "./server/ProfileService.ts";

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
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        discord: {
            clientId: DISCORD_CLIENT as string,
            clientSecret: DISCORD_SECRET as string,
        },
        google: {
            clientId: GOOGLE_CLIENT as string,
            clientSecret: GOOGLE_SECRET as string,
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
});