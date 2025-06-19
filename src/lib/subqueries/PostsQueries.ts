import { sql } from "drizzle-orm"

/**
 * Creates a subquery to check if a user has liked a specific post.
 *
 * @param userId - The ID of the user to check for. If `null`, the subquery will always return `false`.
 * @returns A Drizzle `sql` template literal that evaluates to `true` if the user has liked the post, otherwise `false`.
 * @example
 * // Usage within a Drizzle query:
 * db.select({
 * id: posts.id,
 * content: posts.content,
 * isLiked: isLikedSubquery("user123")
 * }).from(posts);
 */
export const isLikedSubquery = (userId: string | null) => {
    if (userId) {
        return sql<boolean>`EXISTS (
            SELECT 1 FROM likes
            WHERE likes.object_id = posts.id
            AND likes.object_type = 'post'
            AND likes.user_id = ${userId}
        )`
    }
    else {
        return sql<boolean>`false`
    }
}

/**
 * Creates a sorting function for Drizzle queries based on creation date.
 *
 * @param orderBy - The desired sort order: "desc" for descending (newest first), or any other value for ascending (oldest first).
 * @returns A function that takes `posts` (the table alias) and `drizzle-orm`'s `desc`/`asc` helpers,
 * and returns an array of sort conditions for Drizzle queries.
 * @example
 * // Usage within a Drizzle query:
 * db.select().from(posts).orderBy(orderBySort("desc")(posts, { desc, asc }));
 */
export const orderBySort = (orderBy: string | null) => {
    if (orderBy === "desc") {
        return (posts, { desc }) => [desc(posts.createdAt)]
    }
    else {
        return (posts, { asc }) => [asc(posts.createdAt)]
    }
}