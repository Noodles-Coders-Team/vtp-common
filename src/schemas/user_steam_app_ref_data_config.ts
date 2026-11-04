import {SteamAppRefDataSchema} from "./steam_app_reference_data";
import {z} from "zod";


export const UserSteamAppRefDataConfigSchema = z.object({
    ...SteamAppRefDataSchema.shape,
    score: z.int().default(0)
});


export type UserSteamAppRefDataConfigDto = z.infer<typeof UserSteamAppRefDataConfigSchema>;