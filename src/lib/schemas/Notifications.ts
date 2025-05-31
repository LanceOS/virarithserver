import { pgTable, timestamp, text, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { sql } from "drizzle-orm";
import { posts } from "./Posts.ts";
import { comments } from "./Comments.ts";
import { commentReply } from "./CommentReply.ts";


export const notifications = pgTable('notifications', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    postId: uuid("post_id").references(() => posts.id),
    userId: text("user_id").references(() => user.id),
    commentId: uuid("comment_id").references(() => comments.id),
    commentReplyId: uuid("comment_reply_id").references(() => commentReply.id),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})
