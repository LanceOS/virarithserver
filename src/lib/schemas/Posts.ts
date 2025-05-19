import { pgTable, timestamp, varchar, text, boolean, uuid } from "drizzle-orm/pg-core";
// import { users } from "./Users.ts";


export const posts = pgTable('posts', {
    id: uuid().primaryKey().notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    content: text("content").notNull(),
    // user_id: integer("user_id").notNull().references(() => users.id).notNull(),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})