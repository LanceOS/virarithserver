import { pgTable, serial, timestamp, varchar, text, integer, boolean } from "drizzle-orm/pg-core";
// import { users } from "./Users.ts";


export const posts = pgTable('posts', {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    content: text("content").notNull(),
    // user_id: integer("user_id").notNull().references(() => users.id).notNull(),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})