import { Events } from "discord.js";

import type { DiscordEvent } from "@/types/discord";
import { deployCommands } from "@/utils/framework/deploy-commands";

type Event = DiscordEvent<typeof name>;

const name = Events.GuildCreate;

const execute: Event["execute"] = async guild => await deployCommands(guild);

export const guildCreate = { name, execute } satisfies Event;
