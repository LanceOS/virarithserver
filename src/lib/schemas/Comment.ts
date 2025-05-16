import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const comment = pgTable("comment", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    content: varchar("content", { length: 256 }).notNull(),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})