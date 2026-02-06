import { z } from 'zod';

export const productMaterialSchema = z.object({
    product_id: z.string().min(1, 'Product ID is required'),
    raw_material_id: z.string().min(1, 'Raw Material ID is required'),
    required_quantity: z.number().int().min(1, 'Required quantity must be at least 1'),
    created_by: z.string(),
    updated_by: z.string(),
});

export const productMaterialSchemaUpdate = productMaterialSchema.partial();

export type ProductMaterialSchema = z.infer<typeof productMaterialSchema>;
export type ProductMaterialSchemaUpdate = z.infer<typeof productMaterialSchemaUpdate>;