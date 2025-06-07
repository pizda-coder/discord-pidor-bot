import { SlashCommandBuilder } from "discord.js";

import { seasons } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("newseason")
    .setDescription("Vote for the end of the season, but no more than once a day")
    .setNameLocalization("ru", "пидорызаебали")
    .setDescriptionLocalization("ru", "Проголосовать за конец сезона, но не более 1 раза в сутки");

const execute: DiscordCommand["execute"] = async interaction => {
    if (!interaction.channel?.isSendable()) return;

    const defer = await interaction.deferReply();
    const { guild, user } = interaction;

    if (!guild) return;

    const now = new Date();

    const voteInfo = await seasons.voteInfo(guild.id, user.id, daysAgo(now, 1));
    const { activeUser, activeUserCount, userVote, totalVoteCount, currentSeason } = voteInfo;

    if (activeUser === null) {
        defer.edit("Несомненно, но ты даже не участник нашей занимательной викторины, так что мне похуй");
        return;
    }

    if (currentSeason?.timestamp) {
        const { timestamp } = currentSeason;

        if (daysAgo(now, 30) < timestamp) {
            const parts = timestamp.toISOString().split("T", 2);

            const date = parts[0];
            const time = parts[1].split(".", 1)[0];

            defer.edit(`Минимальная длина сезона: 30 дней. Текущий сезон начался: ${date} в ${time}`);
            return;
        }
    }

    if (userVote !== null) {
        const secondsInOneDay = 24 * 60 * 60;
        const secondsToAnotherVote = secondsInOneDay - (now.getTime() - userVote.timestamp.getTime()) / 1000;

        defer.edit(`Да-да, ты уже говорил -_- Попробуй еще раз, но через ${secondsToAnotherVote} секунд(у/ы)`);
        return;
    }

    await seasons.vote(guild.id, user.id);

    const newTotalVoteCount = totalVoteCount + 1;
    const votesRemain = Math.ceil(activeUserCount / 2) - newTotalVoteCount;

    if (votesRemain <= 0) {
        const newSeason = await seasons.startNew(guild.id);

        defer.edit(
            `В этом сезоне пидоры конкретно всех заебали! Стартовал новый, ${newSeason.index + 1} сезон. Пора снова узнать /ктопидор`
        );
    } else {
        defer.edit(
            `В этом сезоне пидоры уже заебали ${newTotalVoteCount} человек(а), до нового сезона осталось заебать: ${votesRemain}`
        );
    }
};

const daysAgo = (date: Date, count: number) => {
    const newDate = new Date(date);

    newDate.setDate(newDate.getDate() - count);

    return newDate;
};

export const gayNewSeason = { data, execute } satisfies DiscordCommand;
