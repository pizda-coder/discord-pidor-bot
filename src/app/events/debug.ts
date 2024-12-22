import { Events } from "discord.js";

import { logger } from "@/shared/logging";
import type { DiscordEvent } from "@/shared/types/discord";

type Event = DiscordEvent<typeof name>;

const name = Events.Debug;
const execute: Event["execute"] = debug => logger.debug(debug);

export const debug = { name, execute } satisfies Event;
