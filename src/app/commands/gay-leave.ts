import { Locale, SlashCommandBuilder } from "discord.js";

import { participants } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Remove yourself from the list of participants")
    .setNameLocalization("ru", "распидорасить")
    .setDescriptionLocalization("ru", "Удалить себя из списка участников");

const execute: DiscordCommand["execute"] = async interaction => {
    const defer = await interaction.deferReply();
    const { guild, user } = interaction;

    if (!guild) return;

    const response = await participants.update(user.id, guild.id, false);

    if (response.count > 0) {
        await defer.edit(interaction.locale === Locale.Russian ? "Пидарнул пидорка нахуй" : "Where are you going?!");

        return;
    }

    await defer.edit(interaction.locale === Locale.Russian ? "А ты кто вообще?" : "You were not in this game");
};

export const gayLeave = { data, execute } satisfies DiscordCommand;
