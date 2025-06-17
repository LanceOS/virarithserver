/**
 * @file Configures the authentication system using `better-auth`.
 * Sets up database, sessions, user fields, authentication methods, rate limiting, and API path.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./schemas/authentication.ts"
import { DrizzleDB } from "./Drizzle.ts";

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
     * Email verification settings (placeholder).
     */
    emailVerification: {
        // ... (specific email verification configuration)
    },
    /**
     * Discord OAuth provider configuration.
     */
    discord: {
        clientId: process.env.DISCORD_CLIENT_ID as string, // Discord application client ID.
        clientSecret: process.env.DISCORD_CLIENT_SECRET as string, // Discord application client secret.
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