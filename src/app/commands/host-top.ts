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
    } else {
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
    }
};

export const hostTop = { data, execute } satisfies DiscordCommand;
