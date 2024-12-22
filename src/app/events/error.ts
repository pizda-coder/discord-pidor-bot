import { Events } from "discord.js";

import { logger } from "@/shared/logging";
import type { DiscordEvent } from "@/shared/types/discord";

type Event = DiscordEvent<typeof name>;

const name = Events.Error;
const execute: Event["execute"] = error => logger.error(error);

export const error = { name, execute } satisfies Event;
