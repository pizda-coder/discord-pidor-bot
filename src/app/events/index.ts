import { debug } from "./debug";
import { error } from "./error";
import { guildCreate } from "./guild-create";
import { interactionCreate } from "./interaction-create";
import { ready } from "./ready";
import { warn } from "./warn";

export const events = [debug, error, guildCreate, interactionCreate, ready, warn];
