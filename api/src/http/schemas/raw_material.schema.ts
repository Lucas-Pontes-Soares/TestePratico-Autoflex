import { z } from 'zod';

export const rawMaterialSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    stock_quantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
    created_by: z.string(),
    updated_by: z.string(),
});

export const rawMaterialSchemaUpdate = rawMaterialSchema.partial();

export type RawMaterialSchema = z.infer<typeof rawMaterialSchema>;
export type RawMaterialSchemaUpdate = z.infer<typeof rawMaterialSchemaUpdate>;