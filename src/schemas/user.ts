import {z} from "zod";


export const UserSchema = z.object({
    login: z.string().min(2).max(100),
    user_name: z.string().min(2).max(100),
    permission_level: z.string().max(100).nullish()
});


export type UserDto = z.infer<typeof UserSchema>;