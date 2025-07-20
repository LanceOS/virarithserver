import { sql, type InferInsertModel } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";


export const category = pgTable('category', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    category: varchar("category", { length: 32 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})

export type CategorySchema = InferInsertModel<typeof category>;
