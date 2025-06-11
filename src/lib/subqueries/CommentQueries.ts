import { sql } from "drizzle-orm"

/**
 * 
 * @param userId 
 * @returns Checks if user has liked the comment
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

/**
 * 
 * @param postId 
 * @returns Checks number of replies as comment has
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