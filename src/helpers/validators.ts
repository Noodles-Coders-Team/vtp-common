import {z} from "zod";


export function ValidateSchema<T>(body: any, Schema: z.ZodType, isArray: true): T[];
export function ValidateSchema<T>(body: any, Schema: z.ZodType, isArray?: false): T;
export function ValidateSchema<T>(body: any, Schema: z.ZodType, isArray: boolean = false): T {
    const result =
        isArray ?
            Schema.array().safeParse(body) :
            Schema.safeParse(body);

    if (!result.success) {
        console.error(result.error ?? "NONE");
        throw new Error(`Invalid data: ${result.error ?? "NONE"}`);
    }

    return result.data as T;
}