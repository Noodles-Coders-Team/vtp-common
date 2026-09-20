import {z} from "zod";

export const CreateGameInfoSchema = z.object({
    game_id: z.uuid(),
    discussed: z.boolean().default(false),
    can_record: z.boolean().default(false),
    genre: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional().nullable()
});

export const GameInfoSchema = z.object({
    id: z.uuid(),
    ...CreateGameInfoSchema.shape
});

export type CreateGameInfoDto = z.infer<typeof CreateGameInfoSchema>;
export type GameInfoDto = z.infer<typeof GameInfoSchema>;