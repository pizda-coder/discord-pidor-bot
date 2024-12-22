import type { ChatInputCommandInteraction, ClientEvents, SharedSlashCommand } from "discord.js";

export interface DiscordCommand {
    data: SharedSlashCommand;
    execute: (interaction: ChatInputCommandInteraction) => void | Promise<void>;
}

export interface DiscordEvent<Event extends keyof ClientEvents = keyof ClientEvents> {
    name: Event;
    once?: boolean;
    execute: (...args: ClientEvents[Event]) => void | Promise<void>;
}
