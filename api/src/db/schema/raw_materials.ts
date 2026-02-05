import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.ts";

export const raw_materials = pgTable('raw_materials', {
    id: text().primaryKey(),
    createdBy: text().notNull().references(() => users.id),
    updatedBy: text().notNull().references(() => users.id),
    name: text().notNull(),
    stock_quantity: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull()
})