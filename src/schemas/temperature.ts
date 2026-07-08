import { z } from "zod";

export const CreateTemperatureSchema = z.object({
    user_id: z.number().int().positive(),
    inside: z.number().min(-100).max(100),
    outside: z.number().min(-100).max(100)
});

export const TemperatureSchema = z.object({
    id: z.guid(),
    user_id: z.number().int().positive(),
    inside: z.number().min(-100).max(100),
    outside: z.number().min(-100).max(100),
    time: z.string().datetime({ offset: true }).default(new Date().toISOString())
});

export type CreateTemperatureDto = z.infer<typeof CreateTemperatureSchema>;
export type TemperatureDto = z.infer<typeof TemperatureSchema>;