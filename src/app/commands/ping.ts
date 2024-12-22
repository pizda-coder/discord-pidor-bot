import { SlashCommandBuilder } from "discord.js";

import type { DiscordCommand } from "@/shared/types/discord";

const data: DiscordCommand["data"] = new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!");

const execute: DiscordCommand["execute"] = async interaction => {
    await interaction.reply("Pong!");
};

export const ping = { data, execute } satisfies DiscordCommand;
