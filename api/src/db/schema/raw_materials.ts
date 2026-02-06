import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const raw_materials = pgTable('raw_materials', {
    id: text().primaryKey(),
    name: text().notNull(),
    stock_quantity: integer().notNull(),
    createdBy: text().notNull().references(() => users.id),
    updatedBy: text().notNull().references(() => users.id),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull()
})