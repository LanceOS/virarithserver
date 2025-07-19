import { sql, type InferInsertModel } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";


export const topic = pgTable('topic', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    topic: varchar("topic", { length: 32 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})

export type TopicSchema = InferInsertModel<typeof topic>;
