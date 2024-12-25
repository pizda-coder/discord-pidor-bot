import { Events } from "discord.js";

import { logger } from "@/logging";
import type { DiscordEvent } from "@/types/discord";
import { deployCommands } from "@/utils/framework/deploy-commands";

type Event = DiscordEvent<typeof name>;

const name = Events.ClientReady;
const once = true;

const execute: Event["execute"] = async client => {
    logger.info(`Ready! Logged in as ${client.user.tag}`);

    await Promise.all(client.guilds.cache.map(guild => deployCommands(guild)));
};

export const ready = { name, once, execute } satisfies Event;
