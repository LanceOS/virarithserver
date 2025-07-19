import { pgTable, timestamp, text, boolean, uuid, index } from "drizzle-orm/pg-core";
import { user } from "./authentication.ts";
import { sql, type InferInsertModel } from "drizzle-orm";


export const notifications = pgTable('notifications', {
    id: uuid().primaryKey().notNull().default(sql`gen_random_uuid()`),
    senderId: text("sender_id").references(() => user.id),
    receiverId: text("receiver_id").references(() => user.id),
    objectId: uuid("object_id").notNull(),
    objectType: text("object_type").notNull(),
    type: text("type").default("notification").notNull(),
    viewed: boolean("viewed").default(false).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
}, (table) => [
    index("notifications_sender_created_at_desc").on(table.senderId.desc()),
])

export type NotificationSchema = InferInsertModel<typeof notifications>;
