import { Locale, SlashCommandBuilder } from "discord.js";

import { participants } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Add yourself to the list of participants")
    .setNameLocalization("ru", "пидордня")
    .setDescriptionLocalization("ru", "Добавить себя в список участников");

const execute: DiscordCommand["execute"] = async interaction => {
    const { guild, user } = interaction;

    if (!guild) return;

    if (await participants.exists(user.id, guild.id)) {
        await interaction.reply(
            interaction.locale === Locale.Russian
                ? "Ты уже в игре, аллоэ"
                : "You're already participating in this game, silly"
        );

        return;
    }

    await participants.add(user.id, user.displayName, guild.id);

    await interaction.reply(interaction.locale === Locale.Russian ? "Ты в игре, красава" : "You're in game, congrats");
};

export const gayJoin = { data, execute } satisfies DiscordCommand;
