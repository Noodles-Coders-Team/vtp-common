import {z} from "zod";


const BaseUserSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(100),
    callbackURL: z.string(),
});


export const UserSignUp = z.object({
    ...BaseUserSchema.shape,
    name: z.string().min(2).max(50),
});


export type UserSignUpDto = z.infer<typeof UserSignUp>;


export const UserSignInDto = z.object({
    ...BaseUserSchema.shape,
    rememberMe: z.boolean().default(true)
});


export type UserSignInDto = z.infer<typeof UserSignInDto>;