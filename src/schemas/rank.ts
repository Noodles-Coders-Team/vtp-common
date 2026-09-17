import {z} from "zod";

export const CreateRankSchema = z.object({
    id: z.uuid().optional().nullable(),
    game_id: z.string(),
    date: z.string(),
    rank: z.number(),
});

export const RankSchema = z.object({
    id: z.uuid(),
    game_id: z.string(),
    date: z.date(),
    rank: z.number(),
});

export type CreateRankDto = z.infer<typeof CreateRankSchema>;
export type RankDto = z.infer<typeof RankSchema>;