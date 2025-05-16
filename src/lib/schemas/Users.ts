import { pgTable, boolean, timestamp, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { profile } from "./Profile.ts";


export const users = pgTable('users', {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 24 }).notNull(),
    email: varchar("email", { length: 132 }).notNull(),
    verified: boolean("verified"),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})

export const profileInfo = relations(users, ({ one }) => ({
    profile: one(profile)
}))