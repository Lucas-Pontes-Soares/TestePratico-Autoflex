import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.ts";

export const products = pgTable('products', {
    id: text().primaryKey(),
    user_id: text().notNull().references(() => users.id),
    name: text().notNull(),
    value: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull()
})