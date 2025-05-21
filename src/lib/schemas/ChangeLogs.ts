import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const changeLogs = pgTable('change_logs', {
    id: uuid("id").primaryKey().notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})