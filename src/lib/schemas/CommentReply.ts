import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { comments } from "./Comments.ts";
import { sql } from "drizzle-orm";
import { posts } from "./Posts.ts";

export const commentReply = pgTable("comment_reply", {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    postId: uuid("post_id").references(() => posts.id).notNull(),
    parentComment: uuid("parent_comment").references(() => comments.id).notNull(),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})