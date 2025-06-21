/**
 * @file Configures the authentication system using `better-auth`.
 * Sets up database, sessions, user fields, authentication methods, rate limiting, and API path.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./schemas/authentication.ts"
import { DrizzleDB } from "./Drizzle.ts";
import { DISCORD_CLIENT, DISCORD_SECRET, GOOGLE_CLIENT, GOOGLE_SECRET } from "$env/static/private";
import ProfileService from "./server/ProfileService.ts";
/**
 * Initializes and configures the `better-auth` instance.
 *
 * @remarks
 * This configuration includes:
 * - **Database**: Drizzle ORM with PostgreSQL.
 * - **Session**: Expiry and update frequency.
 * - **User**: Adds a 'role' field.
 * - **Auth Methods**: Email/password and Discord.
 * - **Rate Limiting**: Prevents abuse.
 * - **Base Path**: API endpoint for auth routes.
 */
export const auth = betterAuth({
    /**
     * Database adapter configuration using Drizzle ORM.
     */
    database: drizzleAdapter(DrizzleDB, {
        provider: "pg", // PostgreSQL provider.
        schema: schema // Authentication schema.
    }),
    /**
     * Session management settings.
     */
    session: {
        expiresIn: 60 * 60 * 24 * 7, // Session expires in 7 days.
        updateAge: 60 * 60 * 24 // Session `expiresAt` updates after 24 hours of activity.
    },
    /**
     * User-related settings.
     */
    user: {
        /**
         * Additional custom fields for the user profile.
         */
        additionalFields: {
            /** Custom 'role' field. */
            role: {
                type: "string",
                defaultValue: "user" // Default role for new users.
            }
        }
    },
    /**
     * Email and password authentication settings.
     */
    emailAndPassword: {
        enabled: true, // Enable email and password login.
        autoSignIn: false, // Don't auto sign-in after registration.
    },
    /**
     * Discord OAuth provider configuration.
     */
    socialProviders: {
        discord: {
            clientId: DISCORD_CLIENT as string,
            clientSecret: DISCORD_SECRET as string,
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.username,
                    email: profile.email,
                    image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar?.startsWith('a_') ? 'gif' : 'png'}`,
                }
            }
        },
        google: {
            clientId: GOOGLE_CLIENT,
            clientSecret: GOOGLE_SECRET,
            profile(profile) {
                return {
                    id: profile.sub || profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            }
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
    /**
     * Rate limiting configuration.
     */
    rateLimit: {
        window: 10, // 10-second time window.
        max: 100, // Max 100 requests in the window.
    },
    /**
     * Base path for all authentication API routes.
     */
    basePath: "/api/auth",
});