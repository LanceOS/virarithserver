import { sql, type InferInsertModel } from "drizzle-orm";
import { user } from "./authentication.ts";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";


export const followers = pgTable("followers", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    objectId: uuid("object_id").notNull(),
    objectType: text("object_type").notNull(),
    createdAt: timestamp("created_at").defaultNow()
}, (table) => [
    index("followers_userId_created_at_desc").on(table.userId.desc())
])

export type FollowerSchema = InferInsertModel<typeof followers>;