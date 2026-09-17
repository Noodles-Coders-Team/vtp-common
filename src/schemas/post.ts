import {z} from "zod";

export const PostSchema = z.object({
    id: z.string(),
    game_id: z.string().optional().nullable(),
});

export type PostDto = z.infer<typeof PostSchema>;