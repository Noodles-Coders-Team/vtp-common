import { z } from "zod";

export const CreateGameSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  release_date: z.iso.datetime({ offset: true }).optional().nullable(),
  link: z.string().optional().nullable(),
  recorded: z.boolean(),
});

export const GameSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  release_date: z.iso.datetime({ offset: true }).optional().nullable(),
  link: z.string().optional().nullable(),
  recorded: z.boolean(),
});

export type CreateGameDto = z.infer<typeof CreateGameSchema>;
export type GameDto = z.infer<typeof GameSchema>;