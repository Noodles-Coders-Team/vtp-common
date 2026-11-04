import {z} from "zod";


export const SteamAppRefDataSchema = z.object({
    id: z.string(),
    value: z.string(),
    type: z.enum(['GENRE', 'CATEGORY', 'TAG']),
});


export type SteamAppRefDataDto = z.infer<typeof SteamAppRefDataSchema>;