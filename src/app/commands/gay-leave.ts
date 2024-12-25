import { Locale, SlashCommandBuilder } from "discord.js";

import { participants } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Remove yourself from the list of participants")
    .setNameLocalization("ru", "распидорасить")
    .setDescriptionLocalization("ru", "Удалить себя из списка участников");

const execute: DiscordCommand["execute"] = async interaction => {
    const { guild, user } = interaction;

    if (!guild) return;

    if (await participants.remove(user.id, guild.id)) {
        await interaction.reply(
            interaction.locale === Locale.Russian ? "Пидарнул пидорка нахуй" : "Where are you going?!"
        );

        return;
    }

    await interaction.reply(
        interaction.locale === Locale.Russian ? "Нормально же общались" : "You were not in this game"
    );
};

export const gayLeave = { data, execute } satisfies DiscordCommand;
