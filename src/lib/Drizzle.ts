import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres';
import { PRIVATE_POSTGRES_DB, PRIVATE_POSTGRES_PASSWORD, PRIVATE_POSTGRES_URL, PRIVATE_POSTGRES_USER } from '$env/static/private';
import { Pool } from 'pg';


import * as comments from "./server/schemas/Comments.ts";
import * as commentReply from "./server/schemas/CommentReply.ts";
import * as posts from "./server/schemas/Posts.ts";
import * as profile from "./server/schemas/Profile.ts";
import * as reports from "./server/schemas/Category.ts";
import * as topic from "./server/schemas/Category.ts"
import * as relations from "./server/schemas/relations.ts"
import * as authentication from "./server/schemas/authentication.ts"
import * as notifications from "./server/schemas/Notifications.ts"
import * as images from "./server/schemas/Images.ts"
import * as likes from "./server/schemas/Likes.ts"
import * as followers from "./server/schemas/Followers.ts"

const databaseUrl = `postgresql://${PRIVATE_POSTGRES_USER}:${PRIVATE_POSTGRES_PASSWORD}@${PRIVATE_POSTGRES_URL}/${PRIVATE_POSTGRES_DB}`;


const pool = new Pool({
    connectionString: databaseUrl,
    // Optional: Configure pool size and other settings
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait to acquire a client before timing out
});
    
// pool.on("connect", (client) => {
//     console.log("New client connected")
// })
// pool.on("error", (fuckers, client) => {
//     console.error("Refused to connect to client:", fuckers)
//     console.error("Database URL:", databaseUrl)
// })
// pool.on("acquire", (client) => {
//     // console.log("Client has been acquired from the pool")
// })

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("Database connection test successful");
        client.release()
    }
    catch(error) {
        console.error(error)
    }
}

testConnection()

/**
 * importing all schemas and combining them into an object
 */
const schemas = {
    ...comments,
    ...commentReply,
    ...posts,
    ...profile,
    ...reports,
    ...topic,
    ...relations,
    ...authentication,
    ...notifications,
    ...images,
    ...likes,
    ...followers
}


export const DrizzleDB = drizzle(pool, { schema: schemas })