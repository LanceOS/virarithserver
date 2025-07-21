import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";



export const banned = pgTable("banned", {
    id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
    email: text("email").notNull(),
    bannedAt: timestamp("banned_at").defaultNow().notNull(),
    reason: text("reason").notNull()
})