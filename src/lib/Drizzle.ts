import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';




const databaseUrl = `postgresql://${process.env.POSTGRES_USER as string}:${process.env.POSTGRES_PASSWORD as string}@localhost:5432/${process.env.POSTGRES_DB as string}`;


const pool = new Pool({
    connectionString: databaseUrl,
    // Optional: Configure pool size and other settings
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait to acquire a client before timing out
});


export const DrizzleDB = drizzle(pool)