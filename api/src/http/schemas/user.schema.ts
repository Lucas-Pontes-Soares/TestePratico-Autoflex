import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const userSchemaUpdate = userSchema.partial().extend({
    old_password: z.string().min(6, 'Old password must be at least 6 characters long').optional(),
    new_password: z.string().min(6, 'New password must be at least 6 characters long').optional(),
}).superRefine((data, ctx) => {
    if (data.new_password && !data.old_password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Old password is required when setting a new password',
            path: ['old_password'],
        });
    }
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserSchemaUpdate = z.infer<typeof userSchemaUpdate>;