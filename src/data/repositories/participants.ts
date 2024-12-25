import { createRepository } from "./create-repository";

const participants = createRepository(database => {
    const add = async (userId: string, userDisplayName: string, guildId: string) => {
        return await database.participants.create({ data: { userId, userDisplayName, guildId, score: 0 } });
    };

    const all = async (guildId: string) => {
        return await database.participants.findMany({ where: { guildId } });
    };

    const exists = async (userId: string, guildId: string) => {
        const count = await database.participants.count({ where: { guildId, userId } });

        return count > 0;
    };

    const remove = async (userId: string, guildId: string) => {
        const { count } = await database.participants.deleteMany({ where: { userId, guildId } });

        return count > 0;
    };

    const score = async (id: number) => {
        return await database.participants.update({ where: { id }, data: { score: { increment: 1 } } });
    };

    const top = async (count: number, guildId: string) => {
        return await database.participants.findMany({ take: count, where: { guildId }, orderBy: { score: "desc" } });
    };

    return { add, all, exists, remove, score, top };
});

export { participants };
