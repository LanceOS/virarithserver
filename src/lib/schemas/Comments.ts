import { pgTable, boolean, timestamp, uuid, text, index } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { posts } from "./Posts.ts";
import { sql, type InferInsertModel } from "drizzle-orm";

export const comments = pgTable("comments", {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    postId: uuid("post_id").references(() => posts.id).notNull(),
    content: text("content").notNull(),
    type: text("type").default("comment").notNull(),
    isEdited: boolean("is_edited").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
}, (table) => [
    index("comments_post_id_created_at_index").on(table.postId.desc()).concurrently(),
    index("comments_created_at_index").on(table.createdAt.desc()).concurrently()
]);

export type CommentSchema = InferInsertModel<typeof comments>;
