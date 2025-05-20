import { pgTable, integer, boolean, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";

export const reports = pgTable('reports', {
    id: uuid().primaryKey().notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    numOfReports: integer("num_of_reports"),
    problematic: boolean("problematic"),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})