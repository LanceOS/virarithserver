import { sql, type InferInsertModel } from "drizzle-orm";
import { index, text, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { timestamp } from "drizzle-orm/pg-core";



export const likes = pgTable("likes", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    objectId: uuid("object_id").notNull(),
    objectType: text("object_type").notNull(),
    createdAt: timestamp("created_at").defaultNow()
}, (table) => {
    index("likes_created_at_desc").on(table.createdAt.desc()).concurrently()
})

export type LikeSchema = InferInsertModel<typeof likes>;
