import { SlashCommandBuilder, bold } from "discord.js";

import { participants } from "@/data/repositories";
import type { DiscordCommand } from "@/types/discord";

const data: DiscordCommand["data"] = new SlashCommandBuilder()
    .setName("top")
    .setDescription("View the top 10 gays of this server")
    .setNameLocalization("ru", "топпидоров")
    .setDescriptionLocalization("ru", "Посмотреть топ10 пидоров этого сервера")
    .addSubcommand(subcommand =>
        subcommand
            .setName("current")
            .setDescription("Top 10 gays of current season")
            .setNameLocalization("ru", "текущий")
            .setDescriptionLocalization("ru", "Топ10 пидоров за последний сезон")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("season")
            .setDescription("The winners of the last 5 seasons")
            .setNameLocalization("ru", "сезонный")
            .setDescriptionLocalization("ru", "Топовые пидоры последних 5 сезонов")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("overall")
            .setDescription("Top 10 gays of all time")
            .setNameLocalization("ru", "глобальный")
            .setDescriptionLocalization("ru", "Топ10 пидоров за всё время")
    );

const execute: DiscordCommand["execute"] = async interaction => {
    if (!interaction.guild) return;

    const defer = await interaction.deferReply();

    if (interaction.options.getSubcommand(true) === "current") {
        const season = await participants.topByCurrentSeason(interaction.guild.id, 10);

        if (!season.results.length || season.results.every(result => result.count === 0)) {
            await defer.edit(interaction.locale === "ru" ? "Пидорков сезона пока не определяли" : "No games yet");
            return;
        }

        let string = `${bold(interaction.locale === "ru" ? `Топ-10 пидоров сезона ${season.number}:` : `Top 10 gays of season ${season.number}:`)}\n\n`;
        for (const row of season.results) {
            string += `- ${row.participant.userDisplayName}: ${row.count}\n`;
        }

        await defer.edit(string);
    } else if (interaction.options.getSubcommand(true) === "season") {
        const top = await participants.topBySeason(interaction.guild.id, 5);

        if (!top.length || top.every(x => x.maxScore === 0)) {
            await defer.edit(interaction.locale === "ru" ? "Пидорков сезона пока не определяли" : "No games yet");
            return;
        }

        let string = `${bold(interaction.locale === "ru" ? "Топовые пидоры последних 5 сезонов:" : "Top gays of the last 5 seasons:")}\n\n`;
        for (const season of top.sort((x, y) => x.season.index - y.season.index)) {
            string += `- ${bold(`Сезон ${season.season.index + 1}`)}`;
            string += season.season.isActive ? ` ${bold("(текущий)")}: ` : ": ";

            string += season.season.isActive
                ? season.winners
                      .filter(x => x.isActive)
                      .map(x => `${x.userDisplayName} (${season.maxScore})`)
                      .join(", ")
                : season.winners.map(x => `${x.userDisplayName} (${season.maxScore})`).join(", ");
            string += "\n";
        }

        await defer.edit(string);
    } else {
        const top = await participants.topByOverall(interaction.guild.id, 10);

        if (!top.length || top.every(x => x.count === 0)) {
            await defer.edit(interaction.locale === "ru" ? "Пидорков пока не определяли" : "No games yet");
            return;
        }

        let string = `${bold(interaction.locale === "ru" ? "Топ-10 пидоров за всё время:" : "Top 10 gays of all time:")}\n\n`;
        for (const row of top) {
            string += `- ${row.participant.userDisplayName}: ${row.count}\n`;
        }

        await defer.edit(string);
    }
};

export const gayTop = { data, execute } satisfies DiscordCommand;
