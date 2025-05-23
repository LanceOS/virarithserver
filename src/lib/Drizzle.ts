import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';


import * as changeLogs from "./schemas/ChangeLogs.ts";
import * as comment from "./schemas/Comment.ts";
import * as commentReply from "./schemas/CommentReply.ts";
import * as posts from "./schemas/Posts.ts";
import * as profile from "./schemas/Profile.ts";
import * as reports from "./schemas/Topic.ts";
import * as topic from "./schemas/Topic.ts"



const databaseUrl = `postgresql://${process.env.POSTGRES_USER as string}:${process.env.POSTGRES_PASSWORD as string}@localhost:5432/${process.env.POSTGRES_DB as string}`;


const pool = new Pool({
    connectionString: databaseUrl,
    // Optional: Configure pool size and other settings
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait to acquire a client before timing out
});

/**
 * importing all schemas and combining them into an object
 */
const schemas = {
    ...changeLogs,
    ...comment,
    ...commentReply,
    ...posts,
    ...profile,
    ...reports,
    ...topic
}



export const DrizzleDB = drizzle(pool, { schema: schemas })