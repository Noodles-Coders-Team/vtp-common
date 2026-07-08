import { z } from "zod";

export const CreatePostSchema = z.object({
  id: z.uuid(),
  game_id: z.string(),
  publication_time: z.iso.datetime({ offset: true }),
});

export const PostSchema = z.object({
  id: z.uuid(),
  game_id: z.string(),
  publication_time: z.iso.datetime({ offset: true }),
});

export type CreatePostDto = z.infer<typeof CreatePostSchema>;
export type PostDto = z.infer<typeof PostSchema>;