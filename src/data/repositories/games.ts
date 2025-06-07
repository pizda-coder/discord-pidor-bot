import { createRepository } from "./create-repository";

const games = createRepository(database => {
    const addWinner = async (guildId: string, winnerId: number, time: Date) => {
        const season = await database.seasons.findFirst({ where: { guildId, isActive: true }, select: { id: true } });

        return await database.games.create({
            data: { guildId, winnerParticipantId: winnerId, seasonId: season?.id ?? 0, timestamp: time }
        });
    };

    const getWinner = async (guildId: string, time: Date) => {
        const game = await database.games.findFirst({
            where: { guildId, timestamp: { gte: time }, season: { isActive: true } },
            include: { winnerParticipant: true }
        });

        return game?.winnerParticipant;
    };

    return { addWinner, getWinner };
});

export { games };
