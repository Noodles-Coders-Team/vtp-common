import { z } from "zod";

export const CreateUserSchema = z.object({
    login: z.string().min(2).max(100),
    name: z.string().min(2).max(100).optional(),
    city: z.string().max(100).optional()
});

export const UserSchema = z.object({
    id: z.number().int().positive(),
    login: z.string().min(2).max(100),
    name: z.string().min(2).max(100).optional(),
    city: z.string().max(100).optional()
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UserDto = z.infer<typeof UserSchema>;