import { pgTable, varchar, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
// import { users } from "./Users.ts";

export const comment = pgTable("comment", {
    id: uuid().primaryKey().notNull(),
    // userId: integer("user_id").notNull().references(() => users.id),
    title: varchar("title", { length: 100 }).notNull(),
    content: varchar("content", { length: 256 }).notNull(),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})