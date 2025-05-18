import { pgTable, varchar, integer, serial, boolean, timestamp } from "drizzle-orm/pg-core";
// import { users } from "./Users.ts";
// import { relations } from "drizzle-orm";

export const profile = pgTable('profile', {
    id: serial("id").primaryKey(),
    // userId: integer("user_id").references(() => users.id).notNull(),
    bio: varchar("bio", { length: 256 }),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})
