import dotenv from "dotenv";

import type { AppConfig } from "@/shared/types/config";

export const resolveConfig = (): AppConfig => {
    dotenv.config();

    const { DISCORD_CLIENT_ID: clientId, DISCORD_TOKEN: token } = process.env;

    if (!clientId || !token) {
        throw new Error("Missing environment variables");
    }

    return { clientId, token };
};
