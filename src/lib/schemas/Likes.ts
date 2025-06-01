import { sql, type InferInsertModel } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { posts } from "./Posts.ts";
import { comments } from "./Comments.ts";
import { commentReply } from "./CommentReply.ts";
import { user } from "./authentication.ts";



export const likes = pgTable("likes", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    postId: uuid("post_id").references(() => posts.id),
    commentId: uuid("comment_id").references(() => comments.id),
    commentReplyId: uuid("comment_reply_id").references(() => commentReply.id)
})

export type LikeSchema = InferInsertModel<typeof likes>;
