import { randomUUID } from "node:crypto";
import { db } from "../../db/client.ts";
import { schema } from "../../db/schema/index.ts";
import type { ProductSchema, ProductSchemaUpdate } from "../schemas/product.schema.ts";
import { eq, sql } from "drizzle-orm";

export async function create(data: ProductSchema) {
    const newProduct = await db.insert(schema.products).values({
        id: randomUUID(),
        name: data.name,
        value: data.value,
        createdBy: data.created_by,
        updatedBy: data.created_by
    })
    .returning();
  
    return newProduct;
};

export async function get(product_id: string) {
    const product = await db.select().from(schema.products)
    .where(eq(schema.products.id, product_id));
  
    return product;
};

export async function getAll() {
    const products = await db.select().from(schema.products);
  
    return products;
};

export async function remove(product_id: string) {
    const product = await db.delete(schema.products)
    .where(eq(schema.products.id, product_id))
    .returning();
  
    return product;
};

export async function update(product_id: string, data: ProductSchemaUpdate) {
    const product = await db.update(schema.products).set({ 
        name: data.name || undefined, 
        value: data.value || undefined, 
        updatedBy: data.updated_by, 
        updatedAt: sql`NOW()` 
    })
    .where(eq(schema.products.id, product_id))
    .returning();
  
    return product;
}