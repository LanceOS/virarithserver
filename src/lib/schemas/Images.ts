import { sql, type InferInsertModel } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";



export const images = pgTable("images", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    bucketObjectId: text("bucket_object_id").notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    objectId: uuid("object_id").notNull(),
    objectType: text("object_type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("images_created_at_index").on(table.createdAt.desc()).concurrently(),
    index("images_user_id_index").on(table.userId).concurrently()
])

export type ImageSchema = InferInsertModel<typeof images>