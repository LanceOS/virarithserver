import { sql, type InferInsertModel } from "drizzle-orm";
import { user } from "./authentication.ts";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";


export const followers = pgTable("followers", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    senderId: text("sender_id").references(() => user.id).notNull(),
    receiverId: text("receiver_id").references(() => user.id).notNull(),
    objectId: uuid("object_id").notNull(),
    objectType: text("object_type").notNull(),
    createdAt: timestamp("created_at").defaultNow()
}, (table) => [
    index("receiver_id_idx_created_at_desc").on(table.receiverId.desc()),
    index("sender_id_idx_created_at_desc").on(table.senderId.desc())
])

export type FollowerSchema = InferInsertModel<typeof followers>;