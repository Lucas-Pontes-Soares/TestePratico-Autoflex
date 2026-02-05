import { z } from 'zod';

export const productMaterialSchema = z.object({
    product_id: z.string().min(1, 'Product ID is required'),
    raw_material_id: z.string().min(1, 'Raw Material ID is required'),
    required_quantity: z.number().int().min(1, 'Required quantity must be at least 1'),
    user_id: z.string()
});

export type ProductMaterialSchema = z.infer<typeof productMaterialSchema>;
