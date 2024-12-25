import type { Client as DiscordClient, Collection as DiscordCollection } from "discord.js";

import type { AppConfig } from "@/types/config";
import type { DiscordCommand } from "@/types/discord";

declare module "discord.js" {
    interface Client<Ready extends boolean = boolean> extends DiscordClient<Ready> {
        config: AppConfig;
        commands: DiscordCollection<string, DiscordCommand>;
    }
}
