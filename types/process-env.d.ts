declare namespace NodeJS {
    interface ProcessEnv {
        readonly DISCORD_CLIENT_ID?: string;
        readonly DISCORD_TOKEN?: string;

        readonly DATABASE_URL?: string;
        readonly DATABASE_DIRECT_URL?: string;
    }
}
