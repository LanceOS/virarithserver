import { pgTable, timestamp, varchar, text, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";


export const posts = pgTable('posts', {
    id: uuid().primaryKey().notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    content: text("content").notNull(),
    user_id: text("user_id").references(() => user.id).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})