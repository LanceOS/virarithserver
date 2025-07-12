import { sql } from "drizzle-orm"

/**
 * Creates a subquery to check if a user has liked a specific comment.
 *
 * @param userId - The ID of the user to check for. If `null`, the subquery will always return `false`.
 * @returns A Drizzle `sql` template literal that evaluates to `true` if the user has liked the comment, otherwise `false`.
 *
 * @example
 * // Usage within a Drizzle query:
 * db.select({
 * id: comments.id,
 * content: comments.content,
 * isLiked: isLikedSubquery("user123")
 * }).from(comments);
 */
export const isLikedSubquery = (userId: string | null) => {
    if (userId) {
        return sql<boolean>`EXISTS (
            SELECT 1 FROM likes
            WHERE likes.object_id = comments.id
            AND likes.object_type = comments.type
            AND likes.user_id = ${userId}
        )`
    }
    else {
        return sql<boolean>`false`
    }
}



export const isReportedSubquery = (userId: string | null) => {
    if (userId) {
        return sql<boolean>`EXISTS (
            SELECT 1 FROM reports
            WHERE reports.object_id = comments.id
            AND reports.object_type = 'comment'
            AND reports.user_id = ${userId}
        )`
    }
    else {
        return sql<boolean>`false`
    }
}

/**
 * Creates a subquery to count the number of replies a comment has.
 *
 * @param postId - The ID of the post the comments belong to. If provided, the count is filtered by this post.
 * @returns A Drizzle `sql` template literal that returns the total reply count for a comment, aliased as `reply_count`.
 *
 * @example
 * // Usage within a Drizzle query:
 * db.select({
 * id: comments.id,
 * content: comments.content,
 * replyCount: replyCountSubquery("post456")
 * }).from(comments);
 */
export const replyCountSubquery = (postId: string | null) => {
    if(postId) {
        return sql<number>`(
            SELECT COUNT(*)::int
            FROM comment_reply
            WHERE comment_reply.parent_comment = comments.id
            AND comment_reply.post_id = ${postId}
        )`.as('reply_count')
    }
    else {
        return sql<number>`(
            SELECT COUNT(*)::int
            FROM comment_reply
            WHERE comment_reply.parent_comment = comments.id
        )`.as('reply_count')
    }
}