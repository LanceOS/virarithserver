import { pgTable, serial, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
// import { users } from "./Users.ts";

export const comment = pgTable("comment", {
    id: serial("id").primaryKey(),
    // userId: integer("user_id").notNull().references(() => users.id),
    title: varchar("title", { length: 100 }).notNull(),
    content: varchar("content", { length: 256 }).notNull(),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})