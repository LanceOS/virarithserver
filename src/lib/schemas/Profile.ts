import { pgTable, varchar, boolean, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { sql, type InferInsertModel } from "drizzle-orm";

export const profile = pgTable('profile', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    bio: varchar("bio", { length: 256 }),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})


export type ProfileSchema = InferInsertModel<typeof profile>;