import { pgTable, varchar, boolean, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { posts } from "./Posts.ts";

export const comment = pgTable("comment", {
    id: uuid().primaryKey().notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    postId: uuid("post_id").references(() => posts.id).notNull(),
    content: varchar("content", { length: 256 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})