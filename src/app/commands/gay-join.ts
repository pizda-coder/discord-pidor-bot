import { Locale, SlashCommandBuilder } from "discord.js";

import { participants } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";
import { getRandomArrayItem } from "@/utils/common";

const createdVariantsRu = ["Ты в игре, красава", "У нас новый латентный", "Тоже хочешь стать пидором?"];
const updatedVariantsRu = ["Малява по пидору обновлена", "Пидор рэкорд хэз бин апдейтэд нахуй"];

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Add yourself to the list of participants")
    .setNameLocalization("ru", "пидордня")
    .setDescriptionLocalization("ru", "Добавить себя в список участников");

const execute: DiscordCommand["execute"] = async interaction => {
    const defer = await interaction.deferReply();
    const { guild, user } = interaction;

    if (!guild) return;

    const response = await participants.addOrUpdate(user.id, user.displayName, guild.id);

    if (response.created) {
        await defer.edit(
            interaction.locale === Locale.Russian ? getRandomArrayItem(createdVariantsRu) : "You're in game, congrats"
        );
    } else {
        await defer.edit(
            interaction.locale === Locale.Russian
                ? getRandomArrayItem(updatedVariantsRu)
                : "The gay record has been updated"
        );
    }
};

export const gayJoin = { data, execute } satisfies DiscordCommand;
