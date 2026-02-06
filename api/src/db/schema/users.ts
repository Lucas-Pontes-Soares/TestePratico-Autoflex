import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull()
})