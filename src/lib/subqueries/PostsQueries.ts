import { sql } from "drizzle-orm"

/**
 * 
 * @param userId 
 * @returns Checks if user has liked the post
 */
export const isLikedSubquery = (userId: string | null) => {
    if (userId) {
        return sql<boolean>`EXISTS (
            SELECT 1 FROM likes 
            WHERE likes.object_id = posts.id
            AND likes.object_type = posts.type 
            AND likes.user_id = ${userId}
        )`
    }
    else {
        return sql<boolean>`false`
    }
}

/**
 * 
 * @param orderBy 
 * @returns Determines which order the post should be returns in based on date
 */
export const orderBySort = (orderBy: string | null) => {
    if (orderBy === "desc") {
        return (posts, { desc }) => [desc(posts.createdAt)]
    }
    else {
        return (posts, { asc }) => [asc(posts.createdAt)]
    }
}