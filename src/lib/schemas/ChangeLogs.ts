import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { sql } from "drizzle-orm";

export const changeLogs = pgTable('change_logs', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 256 }).notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})