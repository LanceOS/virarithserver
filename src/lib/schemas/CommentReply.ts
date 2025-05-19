import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
// import { users } from "./Users.ts";

export const commentReply = pgTable("comment_reply", {
    id: uuid().primaryKey().notNull(),
    // userId: integer("user_id").notNull().references(() => users.id),
    comment: text("comment").notNull(),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})