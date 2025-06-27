import { pgTable, timestamp, varchar, text, boolean, uuid, index } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { sql, type InferInsertModel } from "drizzle-orm";


export const posts = pgTable('posts', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    category: varchar("category", { length: 64 }).notNull(),
    type: text("type").default("post").notNull(),
    isEdited: boolean("is_edited").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
}, (table) => [
    index("post_created_at_desc_index").on(table.createdAt.desc()),
    index("post_user_id_created_at_desc_index").on(table.userId, table.createdAt.desc()),
    index("post_category_created_at_desc_index").on(table.category, table.createdAt.desc())
])



export type PostSchema = InferInsertModel<typeof posts>;
