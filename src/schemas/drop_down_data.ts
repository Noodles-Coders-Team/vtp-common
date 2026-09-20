import {z} from "zod";

export const DropDownSchema = z.object({

    value: z.string(),
    score: z.number(),
    type: z.string(),
    key: z.string(),
}).transform((data) => {
    if (!data.key)
        return {
            ...data,
            key: data.type + '_' + data.value
        };
    return data;
});

export type DropDownDto = z.infer<typeof DropDownSchema>;