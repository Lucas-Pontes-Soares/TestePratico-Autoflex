import { z } from 'zod';

export const rawMaterialSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    stock_quantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
    user_id: z.string(),
    product_id: z.string(),
    raw_material_id: z.string()
});

export type RawMaterialSchema = z.infer<typeof rawMaterialSchema>;
