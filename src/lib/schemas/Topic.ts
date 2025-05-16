import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";


export const topic = pgTable('topic', {
    id: serial("id").primaryKey(),
    topic: varchar("topic", { length: 32 }).notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})