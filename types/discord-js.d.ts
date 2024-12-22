import type { Client as DiscordClient, Collection as DiscordCollection } from "discord.js";

import type { AppConfig } from "@/shared/types/config";
import type { DiscordCommand } from "@/shared/types/discord";

declare module "discord.js" {
    interface Client<Ready extends boolean = boolean> extends DiscordClient<Ready> {
        config: AppConfig;
        commands: DiscordCollection<string, DiscordCommand>;
    }
}
