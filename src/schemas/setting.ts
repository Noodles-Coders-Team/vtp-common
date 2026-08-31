import { z } from "zod";

export const SettingSchema = z.object({
    key: z.string().min(2),
    value: z.string().min(2),
    display: z.string().min(2)
});

export type SettingDto = z.infer<typeof SettingSchema>;