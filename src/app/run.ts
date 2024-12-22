import { Client, Collection, GatewayIntentBits } from "discord.js";

import type { DiscordCommand } from "@/shared/types/discord";

import { logger } from "@/shared/logging";
import { commands } from "./commands";
import { events } from "./events";
import { resolveConfig } from "./utils";

export const run = async () => {
    logger.info("Preparing...");

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

    client.config = resolveConfig();
    client.commands = new Collection<string, DiscordCommand>(commands.map(command => [command.data.name, command]));

    for (const event of events) {
        if ("once" in event && event.once) {
            (client.once as (...x: unknown[]) => void)(event.name, event.execute);
        } else {
            (client.on as (...x: unknown[]) => void)(event.name, event.execute);
        }
    }

    const shutdown = async () => {
        if (!client.isReady()) return;

        await client.destroy();

        logger.info("Logged off!");
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    await client.login(client.config.token);
};
