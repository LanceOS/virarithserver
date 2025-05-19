import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const topic = pgTable('topic', {
    id: uuid().primaryKey().notNull(),
    topic: varchar("topic", { length: 32 }).notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})