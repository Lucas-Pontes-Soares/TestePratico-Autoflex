import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.number().int().positive('Value must be a positive integer'),
    created_by: z.string(),
    updated_by: z.string(),
});

export const productSchemaUpdate = productSchema.partial().extend({
    updated_by: z.string().min(1, 'Updated by is required'),
});

export type ProductSchema = z.infer<typeof productSchema>;
export type ProductSchemaUpdate = z.infer<typeof productSchemaUpdate>;