import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./schemas/authentication.ts"
import { DrizzleDB } from "./Drizzle.ts";




export const auth = betterAuth({
    database: drizzleAdapter(DrizzleDB, {
        provider: "pg",
        schema: schema
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24
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
    emailVerification: {

    },
    discord: {
        clientId: process.env.DISCORD_CLIENT_ID as string,
        clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
    rateLimit: {
        window: 10, // time window in seconds
        max: 100, // max requests in the window
    },
    basePath: "/api/auth",
});
