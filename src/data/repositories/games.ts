import { createRepository } from "./create-repository";

const games = createRepository(database => {
    const addWinner = async (guildId: string, winnerId: number, time: Date) => {
        return await database.games.create({ data: { guildId, winnerParticipantId: winnerId, timestamp: time } });
    };

    const getWinner = async (guildId: string, time: Date) => {
        const game = await database.games.findFirst({
            where: { guildId, timestamp: { gte: time } },
            include: { winnerParticipant: true }
        });

        return game?.winnerParticipant;
    };

    return { addWinner, getWinner };
});

export { games };
