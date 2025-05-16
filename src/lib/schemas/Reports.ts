import { pgTable, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./Users.ts";

export const reports = pgTable('reports', {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    numOfReports: integer("num_of_reports"),
    problematic: boolean("problematic"),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})