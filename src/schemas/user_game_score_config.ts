import {z} from "zod";
import {UserSteamAppRefDataConfigListSchema} from "./user_steam_app_ref_data_config_list";


export const UserGameScoreConfigSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    score_config_label: z.string(),
    score_config: UserSteamAppRefDataConfigListSchema,
});


export type UserGameScoreConfigDto = z.infer<typeof UserGameScoreConfigSchema>;