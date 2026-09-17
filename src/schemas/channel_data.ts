import {z} from "zod";


export const ChannelDataSchema = z.object({
    id: z.string(),
    views: z.number().int(),
});


export type ChannelDataDto = z.infer<typeof ChannelDataSchema>;