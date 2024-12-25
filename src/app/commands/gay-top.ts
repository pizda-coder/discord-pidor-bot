import { SlashCommandBuilder, bold } from "discord.js";

import { participants } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("top")
    .setDescription("View the top 10 gays of this server")
    .setNameLocalization("ru", "топпидоров")
    .setDescriptionLocalization("ru", "Посмотреть топ10 пидоров этого сервера");

const execute: DiscordCommand["execute"] = async interaction => {
    if (!interaction.guild) return;

    const defer = await interaction.deferReply();

    const top = await participants.top(10, interaction.guild.id);

    if (!top.length) {
        await defer.edit(interaction.locale === "ru" ? "Пидорков пока не определяли" : "No games yet");
        return;
    }

    let string = `${bold(interaction.locale === "ru" ? "Топ-10 пидоров за все время:" : "Top 10 gays of all time:")}\n\n`;
    for (const row of top) {
        string += `- ${row.userDisplayName}: ${row.score}\n`;
    }

    await defer.edit(string);
};

export const gayTop = { data, execute } satisfies DiscordCommand;
