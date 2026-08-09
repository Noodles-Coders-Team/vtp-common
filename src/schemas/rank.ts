import { z } from "zod";

export const CreateRankSchema = z.object({
  game_id: z.string(),
  date: z.string(),
  rank: z.number(),
});

export const RankSchema = z.object({
  id: z.uuid(),
  game_id: z.string(),
  date: z.string(),
  rank: z.number(),
});

export type CreateRankDto = z.infer<typeof CreateRankSchema>;
export type RankDto = z.infer<typeof RankSchema>;