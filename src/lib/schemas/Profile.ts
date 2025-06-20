import { pgTable, varchar, boolean, timestamp, uuid, text, index } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { sql, type InferInsertModel } from "drizzle-orm";

export const profile = pgTable('profile', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    bio: varchar("bio", { length: 500 }),
    discordName: text("discord_name"),
    minecraftName: text("minecraft_name"),
    type: text("type").default("profile").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
}, (table) => [
    index("profile_create_at_index").on(table.createdAt).concurrently(),
    index("profile_user_id_index").on(table.userId).concurrently()
])


export type ProfileSchema = InferInsertModel<typeof profile>;