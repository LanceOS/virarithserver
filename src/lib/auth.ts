import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';


const databaseUrl = `postgresql://${process.env.POSTGRES_USER!}:${process.env.POSTGRES_PASSWORD!}@localhost:5432/${process.env.POSTGRES_DB!}`;


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
    }),
    emailAndPassword: {  
        enabled: true,
        autoSignIn: false
    },
});