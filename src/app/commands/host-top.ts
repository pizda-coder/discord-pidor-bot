import { SlashCommandBuilder, bold } from "discord.js";

import { participants } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("toppidrils")
    .setDescription("View the top 10 pidrils of this server")
    .setNameLocalization("ru", "топпидрил")
    .setDescriptionLocalization("ru", "Посмотреть топ10 пидрил этого сервера")
    .addSubcommand(subcommand =>
        subcommand
            .setName("current")
            .setDescription("Top 10 pidrils of current season")
            .setNameLocalization("ru", "текущий")
            .setDescriptionLocalization("ru", "Топ10 пидрил за последний сезон")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("season")
            .setDescription("The pidrils of the last 5 seasons")
            .setNameLocalization("ru", "сезонный")
            .setDescriptionLocalization("ru", "Топовые пидрилы последних 5 сезонов")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("overall")
            .setDescription("Top 10 pidrils of all time")
            .setNameLocalization("ru", "глобальный")
            .setDescriptionLocalization("ru", "Топ10 пидрил за всё время")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("bygay")
            .setDescription("Top pidrils and their victims")
            .setNameLocalization("ru", "пидорский")
            .setDescriptionLocalization("ru", "Топовые пидрилы и кого они пидорнули")
            .addUserOption(option =>
                option
                    .setName("pidrila")
                    .setDescription("Enter the pidrila")
                    .setNameLocalization("ru", "пидрила")
                    .setDescriptionLocalization("ru", "Укажи пидрилу")
                    .setRequired(false)
            )
    );

const execute: DiscordCommand["execute"] = async interaction => {
    if (!interaction.guild) return;

    const defer = await interaction.deferReply();

    if (interaction.options.getSubcommand(true) === "current") {
        const season = await participants.topHostByCurrentSeason(interaction.guild.id, 10);

        if (!season.results.length || season.results.every(result => result.count === 0)) {
            await defer.edit(interaction.locale === "ru" ? "Пидрил пока не определяли" : "No pidrils yet");
            return;
        }

        let string = `${bold(interaction.locale === "ru" ? `Эти ребята пидорасили всех как могли, но кто же эти герои? Топ-10 пидрил сезона ${season.number}:` : `Top 10 pidrils of season ${season.number}:`)}\n\n`;
        for (const row of season.results) {
            string += `- ${row.participant.userDisplayName}: ${row.count}\n`;
        }

        await defer.edit(string);
    } else if (interaction.options.getSubcommand(true) === "season") {
        const top = await participants.topHostBySeason(interaction.guild.id, 5);

        if (!top.length || top.every(x => x.maxScore === 0)) {
            await defer.edit(interaction.locale === "ru" ? "Пидрил пока не определяли" : "No pidrils yet");
            return;
        }

        let string = `${bold(interaction.locale === "ru" ? "Эти ребята пидорасили всех как могли, но кто же эти герои? Топовые пидрилы последних 5 сезонов:" : "Top pidrils of the last 5 seasons:")}\n\n`;
        for (const season of top.sort((x, y) => x.season.index - y.season.index)) {
            string += `- ${bold(`Сезон ${season.season.index + 1}`)}`;
            string += season.season.isActive ? ` ${bold("(текущий)")}: ` : ": ";

            if (season.participants.length === 0) {
                string += "Не определены";
            } else {
                string += season.season.isActive
                    ? season.participants
                          .filter(x => x.isActive)
                          .map(x => `${x.userDisplayName} (${season.maxScore})`)
                          .join(", ")
                    : season.participants.map(x => `${x.userDisplayName} (${season.maxScore})`).join(", ");
            }

            string += "\n";
        }

        await defer.edit(string);
    } else if (interaction.options.getSubcommand(true) === "overall") {
        const top = await participants.topHostByOverall(interaction.guild.id, 10);

        if (!top.length || top.every(x => x.count === 0)) {
            await defer.edit(interaction.locale === "ru" ? "Пидрил пока не определяли" : "No pidrils yet");
            return;
        }

        let string = `${bold(interaction.locale === "ru" ? "Эти ребята пидорасили всех как могли, но кто же эти герои? Топ-10 пидрил за всё время:" : "Top 10 pidrils of all time:")}\n\n`;
        for (const row of top) {
            string += `- ${row.participant.userDisplayName}: ${row.count}\n`;
        }

        await defer.edit(string);
    } else {
        const overall = await participants.topHostWithWinnerByOverall(interaction.guild.id);
        const target = interaction.options.getUser("pidrila", false);

        if (overall.games.length === 0) {
            await defer.edit(interaction.locale === "ru" ? "Пидрил пока не определяли" : "No pidrils yet");
            return;
        }

        let finalUserId = "";

        if (target) {
            if (overall.games.some(game => game.hostUserId === target.id)) {
                finalUserId = target.id;
            } else {
                await defer.edit(
                    interaction.locale === "ru"
                        ? `${bold(target.displayName)} пока никого не пидорасил!`
                        : `${bold(target.displayName)} hasn't fucked anyone yet!`
                );
                return;
            }
        }

        let string = finalUserId
            ? `${bold(
                  interaction.locale === "ru"
                      ? `Сейчас мы узнаем кого ${target?.displayName} пидорасил больше всего:`
                      : `Now we'll find out who ${target?.displayName} fucked whom the most:`
              )}\n\n`
            : `${bold(
                  interaction.locale === "ru"
                      ? "Сейчас мы узнаем кто кого пидорасил больше всего:"
                      : "Now we'll find out who fucked whom the most:"
              )}\n\n`;

        const groupedByHost = overall.games.reduce(
            (acc, { hostUserId, winnerUserId, winnerScore }) => {
                if (!acc[hostUserId]) {
                    acc[hostUserId] = [];
                }

                const existingGroup = acc[hostUserId].find(group => group.score === winnerScore);

                if (existingGroup) {
                    existingGroup.winners.push(winnerUserId);
                } else {
                    acc[hostUserId].push({
                        score: winnerScore,
                        winners: [winnerUserId]
                    });
                }

                return acc;
            },
            {} as Record<string, { score: number; winners: string[] }[]>
        );

        const result = Object.entries(groupedByHost).map(([hostUserId, results]) => ({
            hostUserId,
            results: results
                .sort((a, b) => b.score - a.score)
                .map(result => ({
                    score: result.score,
                    winners: result.winners.sort()
                }))
        }));

        const finalResult = result.sort((a, b) => {
            const maxScoreA = Math.max(...a.results.map(r => r.score));
            const maxScoreB = Math.max(...b.results.map(r => r.score));

            return maxScoreB - maxScoreA;
        });

        const finalWithDisplayNames = finalResult
            .map(hostGroup => ({
                hostUserId: hostGroup.hostUserId,
                hostDisplayName: overall.players[hostGroup.hostUserId],
                results: hostGroup.results.map(result => ({
                    score: result.score,
                    winners: result.winners.map(winnerUserId => overall.players[winnerUserId])
                }))
            }))
            .filter(x => (finalUserId ? x.hostUserId === finalUserId : true));

        for (const row of finalWithDisplayNames) {
            const isMultiple = finalWithDisplayNames.length > 1;

            if (isMultiple) {
                string += bold(row.hostDisplayName);
                string += ": ";
            }

            string += row.results
                .map(
                    (data, i) =>
                        `${isMultiple ? "\n" : row === finalWithDisplayNames[0] && i === 0 ? "" : "\n"}- ${bold(data.score.toString())} (${data.winners.join(", ")})`
                )
                .join("");

            string += "\n";
        }

        await defer.edit(string);
    }
};

export const hostTop = { data, execute } satisfies DiscordCommand;
