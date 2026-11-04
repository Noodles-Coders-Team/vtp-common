import {UserSteamAppRefDataConfigSchema} from "./user_steam_app_ref_data_config";
import {z} from "zod";


export const UserSteamAppRefDataConfigListSchema = z.array(UserSteamAppRefDataConfigSchema);


export type UserSteamAppRefDataConfigListDto = z.infer<typeof UserSteamAppRefDataConfigListSchema>;