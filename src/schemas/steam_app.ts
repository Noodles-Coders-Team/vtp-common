import {z} from "zod";

export const SteamAppSchema = z.object({
    id: z.int(),
    name: z.string().nullish(),
    categories: z.array(z.string()).optional(),
    genres: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    release_date: z.coerce.date().nullish(),
    last_info_updated: z.coerce.date().nullish(),
    review_count: z.number().nullish(),
    review_positive_count: z.number().nullish(),
    review_positive_percent: z.number().nullish(),
});

export type SteamAppDto = z.infer<typeof SteamAppSchema>;