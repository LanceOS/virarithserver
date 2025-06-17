import { sql, type InferInsertModel } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";


export const ghostUser = pgTable("ghost_user", {
    id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
    name: text("name").notNull().default("Ghost User"),
    email: text("email").notNull().default("deleted@gmail.com"),
});

export type GhostSchema = InferInsertModel<typeof ghostUser>;
