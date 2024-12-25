import { Events } from "discord.js";

import { logger } from "@/logging";
import type { DiscordEvent } from "@/types/discord";

type Event = DiscordEvent<typeof name>;

const name = Events.Debug;
const execute: Event["execute"] = debug => logger.debug(debug);

export const debug = { name, execute } satisfies Event;
