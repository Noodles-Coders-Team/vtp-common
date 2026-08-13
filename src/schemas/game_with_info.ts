import { z } from "zod";
import { GameSchema } from "./game";
import { GameInfoSchema } from "./game_info";

export const GameWithInfoSchema = z.object({
    ...GameSchema.shape,
    ...GameInfoSchema.omit({ id: true, game_id: true }).shape,
    game_score: z.number().optional().nullable()
});

export type GameWithInfoDto = z.infer<typeof GameWithInfoSchema>;