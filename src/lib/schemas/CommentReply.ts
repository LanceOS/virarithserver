import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { comments } from "./Comments.ts";

export const commentReply = pgTable("comment_reply", {
    id: uuid().primaryKey().notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    parentComment: uuid("parent_comment").references(() => comments.id).notNull(),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})