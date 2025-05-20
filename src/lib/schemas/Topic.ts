import { pgTable, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";


export const topic = pgTable('topic', {
    id: uuid().primaryKey().notNull(),
    topic: varchar("topic", { length: 32 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})