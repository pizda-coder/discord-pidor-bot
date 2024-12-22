import { Events, MessageFlags } from "discord.js";

import { logger } from "@/shared/logging";
import type { DiscordEvent } from "@/shared/types/discord";

type Event = DiscordEvent<typeof name>;

const name = Events.InteractionCreate;

const execute: Event["execute"] = async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        logger.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        logger.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};

export const interactionCreate = { name, execute } as Event;
