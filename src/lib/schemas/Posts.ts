import { pgTable, timestamp, varchar, text, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { sql, type InferInsertModel } from "drizzle-orm";


export const posts = pgTable('posts', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 100 }).notNull(),
    content: text("content").notNull(),
    user_id: text("user_id").references(() => user.id).notNull(),
    topic: varchar("topic", { length: 32 }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})



export type NewPost = InferInsertModel<typeof posts>;
