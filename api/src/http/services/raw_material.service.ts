import { randomUUID } from "node:crypto";
import type { UUID } from "node:crypto";
import { db } from "../../db/client.ts";
import { schema } from "../../db/schema/index.ts";
import type { RawMaterialSchema, RawMaterialSchemaUpdate } from "../schemas/raw_material.schema.ts";
import { eq, sql } from "drizzle-orm";

export async function create(data: RawMaterialSchema) {
    const newRawMaterial = await db.insert(schema.raw_materials).values({
        id: randomUUID(),
        name: data.name,
        stock_quantity: data.stock_quantity,
        createdBy: data.created_by,
        updatedBy: data.updated_by
    })
    .returning();
  
    return newRawMaterial;
};

export async function get(raw_material_id: UUID) {
    const rawMaterial = await db.select().from(schema.raw_materials)
    .where(eq(schema.raw_materials.id, raw_material_id));
  
    return rawMaterial;
};

export async function getAll() {
    const rawMaterials = await db.select().from(schema.raw_materials);
  
    return rawMaterials;
};

export async function remove(raw_material_id: UUID) {
    const rawMaterial = await db.delete(schema.raw_materials)
    .where(eq(schema.raw_materials.id, raw_material_id))
    .returning();
  
    return rawMaterial;
};

export async function update(raw_material_id: UUID, data: RawMaterialSchemaUpdate) {
    const rawMaterial = await db.update(schema.raw_materials).set({ 
        name: data.name || undefined, 
        stock_quantity: data.stock_quantity || undefined, 
        updatedBy: data.updated_by, 
        updatedAt: sql`NOW()` 
    })
    .where(eq(schema.raw_materials.id, raw_material_id))
    .returning();
  
    return rawMaterial;
}
