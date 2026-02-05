import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.ts";
import { products } from "./products.ts";
import { raw_materials } from "./raw_materials.ts";

export const products_materials = pgTable('products_materials', {
    id: text().primaryKey(),
    createdBy: text().notNull().references(() => users.id),
    updatedBy: text().notNull().references(() => users.id),
    product_id: text().notNull().references(() => products.id),
    raw_material_id: text().notNull().references(() => raw_materials.id),
    required_quantity: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull()
})