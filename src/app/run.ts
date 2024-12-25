import { Client, GatewayIntentBits } from "discord.js";

import { logger } from "@/logging";

import { events } from "./events";
import { resolveCommands } from "./resolve-commands";
import { resolveConfig } from "./resolve-config";

export const run = async () => {
    logger.info("Preparing...");

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

    client.commands = resolveCommands();
    client.config = resolveConfig();

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
