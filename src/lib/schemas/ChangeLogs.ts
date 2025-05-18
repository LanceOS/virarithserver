import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const changeLogs = pgTable('change_logs', {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    isDeleted: boolean(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})