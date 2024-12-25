import { type Guild, REST, Routes } from "discord.js";

import { logger } from "@/logging";

export const deployCommands = async (guild: Guild) => {
    const { id, name, client } = guild;
    const { config, commands } = client;

    try {
        logger.info(`Started refreshing ${commands.size} application (/) commands (Server: ${name}).`);

        const rest = new REST().setToken(config.token);

        const route = Routes.applicationGuildCommands(config.clientId, id);
        const body = commands.map(command => command.data.toJSON());

        const response = await rest.put(route, { body });

        logger.info(
            `Successfully reloaded ${Array.isArray(response) ? response.length : "?"} application (/) commands (Server: ${name}).`
        );
    } catch (error) {
        logger.error(error);
    }
};
