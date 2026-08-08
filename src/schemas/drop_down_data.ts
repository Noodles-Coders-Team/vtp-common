import { z } from "zod";

export const DropDownSchema = z.object({
    key: z.string().optional().nullable(),
    value: z.string(),
    score: z.number(),
    type: z.string()
});

export type DropDownDto = z.infer<typeof DropDownSchema>;