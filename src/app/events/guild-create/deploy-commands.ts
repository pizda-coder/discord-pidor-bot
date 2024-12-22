import { REST, type RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";

import { logger } from "@/shared/logging";
import type { AppConfig } from "@/shared/types/config";

interface DeploymentPack {
    commands: RESTPostAPIApplicationCommandsJSONBody[];
    config: AppConfig;
    guildId: string;
}

export const deployCommands = async (pack: DeploymentPack) => {
    const { config, commands, guildId } = pack;

    try {
        logger.info(`Started refreshing ${commands.length} application (/) commands.`);

        const rest = new REST().setToken(config.token);

        const route = Routes.applicationGuildCommands(config.clientId, guildId);
        const response = await rest.put(route, { body: commands });

        logger.info(
            `Successfully reloaded ${Array.isArray(response) ? response.length : "?"} application (/) commands.`
        );
    } catch (error) {
        logger.error(error);
    }
};
