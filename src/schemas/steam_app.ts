import {z} from "zod";

export const SteamAppSchema = z.object({
    id: z.int(),
    is_data_imported: z.boolean().default(false),
    name: z.string().nullish(),
    categories: z.array(z.string()).optional(),
    genres: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metacritic_score: z.int().nullish(),
    release_date: z.date().nullish(),
    review_count: z.number().nullish(),
});

export type SteamAppDto = z.infer<typeof SteamAppSchema>;