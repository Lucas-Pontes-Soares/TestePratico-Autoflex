import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const products = pgTable('products', {
    id: text().primaryKey(),
    name: text().notNull(),
    value: integer().notNull(),
    createdBy: text().notNull().references(() => users.id),
    updatedBy: text().notNull().references(() => users.id),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull()
})