import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "./schemas/authentication.ts"

import 'dotenv/config'


const databaseUrl = `postgresql://${process.env.POSTGRES_USER as string}:${process.env.POSTGRES_PASSWORD as string}@localhost:5432/${process.env.POSTGRES_DB as string}`;


const pool = new Pool({
    connectionString: databaseUrl,
    // Optional: Configure pool size and other settings
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait to acquire a client before timing out
});


export const DrizzleDB = drizzle(pool)


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
