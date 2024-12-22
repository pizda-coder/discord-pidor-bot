import { Events } from "discord.js";

import { logger } from "@/shared/logging";
import type { DiscordEvent } from "@/shared/types/discord";

type Event = DiscordEvent<typeof name>;

const name = Events.Warn;
const execute: Event["execute"] = warn => logger.warn(warn);

export const warn = { name, execute } satisfies Event;
