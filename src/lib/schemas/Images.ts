import { sql, type InferInsertModel } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";



export const images = pgTable("images", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    objectId: uuid("object_id").notNull(),
    objectType: text("object_type").notNull()
})

export type ImageSchema = InferInsertModel<typeof images>