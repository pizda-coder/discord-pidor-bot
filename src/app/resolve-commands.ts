import { Collection } from "discord.js";

import type { DiscordCommand } from "@/types/discord";

import { gayJoin } from "./commands/gay-join";
import { gayLeave } from "./commands/gay-leave";
import { gayPlay } from "./commands/gay-play";
import { gayTop } from "./commands/gay-top";

export const resolveCommands = () => {
    const commands = [gayJoin, gayLeave, gayPlay, gayTop];

    return new Collection<string, DiscordCommand>(commands.map(command => [command.data.name, command]));
};
