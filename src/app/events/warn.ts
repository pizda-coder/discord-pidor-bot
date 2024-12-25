import { Events } from "discord.js";

import { logger } from "@/logging";
import type { DiscordEvent } from "@/types/discord";

type Event = DiscordEvent<typeof name>;

const name = Events.Warn;
const execute: Event["execute"] = warn => logger.warn(warn);

export const warn = { name, execute } satisfies Event;
