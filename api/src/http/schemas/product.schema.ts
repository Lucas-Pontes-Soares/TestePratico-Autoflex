import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.number().int().positive('Value must be a positive integer'),
    created_by: z.string(),
    updated_by: z.string(),
});

export const productSchemaUpdate = z.object({
    name: z.string().min(1, 'Min is 1 letter').optional(),
    value: z.number().int().positive('Value must be a positive integer').optional(),
    updated_by: z.string(),
});

export type ProductSchema = z.infer<typeof productSchema>;
export type ProductSchemaUpdate = z.infer<typeof productSchemaUpdate>;