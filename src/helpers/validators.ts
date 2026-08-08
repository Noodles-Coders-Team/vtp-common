import { z } from "zod";


export function ValidateSchema<T>(body: any, Schema: z.ZodType): T {
    CheckForNull(body);
    // Validate the form data using the Schema
    const result = Schema.safeParse(body);

    if (!result.success) {
        console.error(result.error ?? "NONE");
        throw new Error(`Invalid data: ${result.error ?? "NONE"}`);
    }

    return result.data as T;
}

export function ValidateSchemaArray<T>(body: any, Schema: z.ZodType,): T {
    CheckForNull(body);
    const result = Schema.array().safeParse(body);

    if (!result.success) {
        console.error(result.error ?? "NONE");
        throw new Error(`Invalid data: ${result.error ?? "NONE"}`);
    }

    return result.data as T;
}

function CheckForNull(body: any){
    if (body === null || body === undefined)
        throw new Error("Body is null | undefined");
}