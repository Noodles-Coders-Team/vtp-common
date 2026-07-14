import { z } from "zod";
import { GameSchema } from "./game";
import { GameInfoSchema } from "./game_info";

export const GameWithInfoSchema = GameSchema.extend({ game_info: GameInfoSchema });

export type GameWithInfoDto = z.infer<typeof GameWithInfoSchema>;