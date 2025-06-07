import { createRepository } from "./create-repository";

const seasons = createRepository(database => {
    const vote = async (guildId: string, userId: string) => {
        return await database.seasonEndVotes.create({ data: { guildId, userId } });
    };

    const voteInfo = async (guildId: string, userId: string, time: Date) => {
        const [activeUserCount, activeUser, totalVoteCount, userVote, currentSeason] = await Promise.all([
            database.participants.count({ where: { guildId, isActive: true } }),
            database.participants.findFirst({ where: { guildId, userId, isActive: true } }),
            database.seasonEndVotes.count({ where: { guildId, timestamp: { gte: time } } }),
            database.seasonEndVotes.findFirst({
                where: { guildId, userId, timestamp: { gte: time } },
                select: { timestamp: true }
            }),
            database.seasons.findFirst({ where: { guildId, isActive: true } })
        ]);

        return { activeUserCount, activeUser, totalVoteCount, userVote, currentSeason };
    };

    const startNew = async (guildId: string) => {
        await database.seasonEndVotes.deleteMany({ where: { guildId } });

        const deactivated = await database.seasons.updateManyAndReturn({
            where: { guildId, isActive: true },
            data: { isActive: false }
        });

        return await database.seasons.create({ data: { guildId, index: deactivated[0].index + 1 } });
    };

    return { vote, voteInfo, startNew };
});

export { seasons };
