import { Events } from "discord.js";

import type { DiscordEvent } from "@/shared/types/discord";

import { deployCommands } from "./deploy-commands";

type Event = DiscordEvent<typeof name>;

const name = Events.GuildCreate;

const execute: Event["execute"] = async guild => {
    await deployCommands({
        commands: guild.client.commands.map(command => command.data.toJSON()),
        config: guild.client.config,
        guildId: guild.id
    });
};

export const guildCreate = { name, execute } satisfies Event;
