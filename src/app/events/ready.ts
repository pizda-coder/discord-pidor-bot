import { Events } from "discord.js";

import { logger } from "@/shared/logging";
import type { DiscordEvent } from "@/shared/types/discord";

type Event = DiscordEvent<typeof name>;

const name = Events.ClientReady;
const once = true;

const execute: Event["execute"] = client => logger.info(`Ready! Logged in as ${client.user.tag}`);

export const ready = { name, once, execute } satisfies Event;
