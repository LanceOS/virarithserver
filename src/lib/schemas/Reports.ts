import { pgTable, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
// import { users } from "./Users.ts";

export const reports = pgTable('reports', {
    id: uuid().primaryKey().notNull(),
    // userId: integer("user_id").notNull().references(() => users.id).notNull(),
    numOfReports: integer("num_of_reports"),
    problematic: boolean("problematic"),
    isDeleted: boolean("is_deleted"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
})