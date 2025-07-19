import { sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";


export const archived = pgTable("archived", {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    archiver: text("archiver").references(() => user.id).notNull(),
    objectId: uuid("object_id").notNull(),
    objectType: text("object_type").notNull(),
    archivedAt: timestamp("archived_at").defaultNow().notNull()
}, (table) => [
    index("archived_at_index").on(table.archivedAt.desc()),
])