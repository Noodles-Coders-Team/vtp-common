import {z} from "zod";

export const CreateGameSchema = z.object({
    name: z.string(),
    release_date: z.date().optional().nullable(),
    link: z.string().optional().nullable(),
    recorded: z.boolean(),
});

export const GameSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    release_date: z.date().optional().nullable(),
    link: z.string().optional().nullable(),
    recorded: z.boolean(),
});

export type CreateGameDto = z.infer<typeof CreateGameSchema>;
export type GameDto = z.infer<typeof GameSchema>;