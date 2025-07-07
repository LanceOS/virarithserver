import { pgTable, integer, boolean, timestamp, uuid, text, index } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { sql } from "drizzle-orm";

export const reports = pgTable('reports', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id).notNull(),
    objectId: uuid("object_id").notNull(),
    objectType: text("object_type").notNull(),
    score: integer().default(0).notNull(),
    flagged: boolean("flagged").default(false).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
}, (table) => [
    index("report_by_user_desc").on(table.userId.desc())
])