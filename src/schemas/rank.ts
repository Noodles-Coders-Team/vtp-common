import { z } from "zod";

export const CreateRankSchema = z.object({
  game_id: z.string(),
  version_id: z.number().int(),
  date: z.iso.datetime({ offset: true }),
  rank: z.number(),
});

export const RankSchema = z.object({
  id: z.uuid(),
  game_id: z.string(),
  version_id: z.number().int(),
  date: z.iso.datetime({ offset: true }),
  rank: z.number(),
});

export type CreateRankDto = z.infer<typeof CreateRankSchema>;
export type RankDto = z.infer<typeof RankSchema>;