import { z } from "zod";

export const CreateChannelDataSchema = z.object({
  id: z.iso.datetime({ offset: true }),
  views: z.number().int(),
});

export const ChannelDataSchema = z.object({
  id: z.iso.datetime({ offset: true }),
  views: z.number().int(),
});

export type CreateChannelDataDto = z.infer<typeof CreateChannelDataSchema>;
export type ChannelDataDto = z.infer<typeof ChannelDataSchema>;