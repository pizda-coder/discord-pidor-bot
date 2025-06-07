import { SlashCommandBuilder, bold, userMention } from "discord.js";

import { games, participants } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";
import { getRandomArrayItem, sleep } from "@/utils/common";

const teaseVariants = [
    ["Woob-woob, that's da sound of da pidor-police!", "Выезжаю на место...", "Но кто же он?"],
    [
        "Woob-woob, that's da sound of da pidor-police!",
        "Ведётся поиск в базе данных",
        "Ведётся захват подозреваемого..."
    ],
    ["Что тут у нас?", "А могли бы на работе делом заниматься...", "Проверяю данные..."],
    ["Инициирую поиск пидора дня...", "Машины выехали", "Так-так, что же тут у нас..."],
    ["Что тут у нас?", "Военный спутник запущен, коды доступа внутри...", "Не может быть!"],
    ["Мало вам пидоров что-ли?", "Боевые танцы с бубном активированы!", "Нихуясе..."],
    ["Опять в эти ваши игрульки играете?", "Ну ладно...", "Ведется поиск пидора...."],
    ["Как будто вы и так не знали кто пидор :/", "Нет, ну правда", "Вы точно хотите это услышать..? Ну лааадно..."],
    ["Ищем, у кого есть кружка Peder", "Поиск немного затягивается...", "А, не, нашел!"],
    ["Изучаем фото с ЛГБТ-митингов", "Лучше бы я этого не делал...", "Вы не поверите, кого я нашел!"],
    ["Такс, такс, такс, кто сегодня пидор дня?", "Или даже пидор-ня? :3", "Кажется нашел..."]
];

const results = [
    "А вот и пидор - ",
    "Вот ты и пидор, ",
    "Ну ты и пидор, ",
    "Сегодня ты пидор, ",
    "В ряду пидоров пополнение: ",
    "И пидорасина сегодня... ",
    'Мистер "Задний привод дня" - ',
    "Анализ завершен, сегодня ты пидор, ",
    "ВЖУХ И ТЫ ПИДОР, ",
    "ХОБА И ТЫ ПИДОР, ",
    "Хоп, у нас тут пидорок: ",
    "ВНИМАНИЕ! Замечена пидорасина - ",
    "Кто бы мог подумать, но пидор дня - ",
    "Пидор дня обыкновенный, 1шт. - ",
    "Он шифруется, но мы все знаем, что пидор - ",
    "Ого, вы только посмотрите! Пидор дня - ",
    "Стоять! Не двигаться! Вы объявлены пидором дня, ",
    "Cами леса Лордерона прошептали мне имя этого пидора - ",
    "И прекрасный человек дня сегодня... а нет, ошибка, всего-лишь пидор - "
];

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Roulette launch, but no more than once a day")
    .setNameLocalization("ru", "ктопидор")
    .setDescriptionLocalization("ru", "Запуск рулетки, но не более 1 раза в сутки");

const execute: DiscordCommand["execute"] = async interaction => {
    if (!interaction.channel?.isSendable()) return;

    const defer = await interaction.deferReply();
    const { guild } = interaction;

    if (!guild) return;

    const host = await participants.get(interaction.user.id, guild.id);
    if (!host) {
        await defer.edit(
            interaction.locale === "ru" ? "Ты даже не участник игры, отдыхай!" : "You are not even a player, relax"
        );
        return;
    }

    let winner = await games.getWinner(guild.id, new Date(new Date().setHours(0, 0, 0, 0)));
    if (winner) {
        const isRu = interaction.locale === "ru";
        const isSameUser = winner.userId === interaction.user.id;

        const start = isRu ? "А пидор сегодня - " : "And the winner today is - ";
        const end = isSameUser ? (isRu ? "это ТЫ!" : "YOU!") : winner.userDisplayName;

        await defer.edit(start + bold(end));
        return;
    }

    const guildParticipants = await participants.all(guild.id);

    if (!guildParticipants?.length) {
        await defer.edit(interaction.locale === "ru" ? "Нет зарегестрированных участников" : "No players");
        return;
    }

    const teaseVariant = getRandomArrayItem(teaseVariants);

    await defer.edit(teaseVariant[0]);
    await sleep(500);

    for (const tease of teaseVariant.slice(1)) {
        await interaction.channel.send(tease);
        await sleep(500);
    }

    winner = getRandomArrayItem(guildParticipants);

    await Promise.all([games.addWinner(guild.id, host.id, winner.id, new Date())]);
    await interaction.channel.send(`${getRandomArrayItem(results)}${userMention(winner.userId)}`);
};

export const gayPlay = { data, execute } satisfies DiscordCommand;
