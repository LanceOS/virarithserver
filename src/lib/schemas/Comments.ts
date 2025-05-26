import { pgTable, varchar, boolean, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { posts } from "./Posts.ts";
import { sql, type InferInsertModel } from "drizzle-orm";

export const comments = pgTable("comments", {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    postId: uuid("post_id").references(() => posts.id).notNull(),
    content: varchar("content", { length: 256 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export type NewComment = InferInsertModel<typeof comments>;
