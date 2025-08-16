import { createRepository } from "./create-repository";

const participants = createRepository(database => {
    const get = async (userId: string, guildId: string) => {
        return await database.participants.findFirst({ where: { userId, guildId, isActive: true } });
    };

    const add = async (userId: string, userDisplayName: string, guildId: string) => {
        return await database.participants.create({ data: { userId, userDisplayName, guildId } });
    };

    const update = async (userId: string, guildId: string, isActive: boolean) => {
        return await database.participants.updateMany({ where: { userId, guildId }, data: { isActive } });
    };

    const addOrUpdate = async (userId: string, userDisplayName: string, guildId: string) => {
        const participant = await database.participants.findFirst({ where: { guildId, userId }, select: { id: true } });

        if (participant?.id === undefined) {
            return { created: true, updated: false, participant: await add(userId, userDisplayName, guildId) };
        }

        return {
            created: false,
            updated: true,
            participant: await database.participants.update({
                where: { id: participant.id },
                data: { userDisplayName, isActive: true }
            })
        };
    };

    const all = async (guildId: string) => {
        return await database.participants.findMany({ where: { guildId, isActive: true } });
    };

    const topByCurrentSeason = async (guildId: string, count: number) => {
        const groups = await database.games.groupBy({
            by: ["guildId", "seasonId", "winnerParticipantId"],
            where: {
                guildId,
                season: {
                    isActive: true
                },
                winnerParticipant: {
                    isActive: true
                }
            },
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: "desc"
                }
            },
            take: count
        });

        const participants = await database.participants.findMany({
            where: {
                id: {
                    in: groups.map(x => x.winnerParticipantId)
                }
            }
        });

        const season = await database.seasons.findFirst({
            where: { guildId, isActive: true },
            select: { index: true }
        });

        const top = {
            number: (season?.index ?? 0) + 1,
            results: groups.map(group => ({
                // biome-ignore lint/style/noNonNullAssertion: We already selected participants above
                participant: participants.find(participant => participant.id === group.winnerParticipantId)!,
                count: group._count.id
            }))
        };

        if (top.results.length < count) {
            const other = await database.participants.findMany({
                where: {
                    guildId,
                    isActive: true,
                    id: {
                        notIn: groups.map(x => x.winnerParticipantId)
                    }
                },
                take: count - top.results.length
            });

            top.results.push(...other.map(participant => ({ participant, count: 0 })));
        }

        return top;
    };

    const topBySeason = async (guildId: string, count: number) => {
        const seasons = await database.seasons.findMany({
            where: { guildId },
            orderBy: { timestamp: "desc" },
            select: { id: true, index: true, isActive: true },
            take: count
        });

        const winners = await database.games.groupBy({
            by: ["seasonId", "winnerParticipantId"],
            where: {
                seasonId: {
                    in: seasons.map(x => x.id)
                },
                winnerParticipant: {
                    isActive: true
                }
            },
            _count: {
                id: true
            }
        });

        const winnersBySeason = seasons.map(season => {
            const seasonWinners = winners.filter(winner => winner.seasonId === season.id);
            const maxScore = Math.max(...seasonWinners.map(winner => winner._count.id));

            return {
                season,
                maxScore,
                winners: seasonWinners
                    .filter(winner => winner._count.id === maxScore)
                    .map(winner => winner.winnerParticipantId)
            };
        });

        const participants = await database.participants.findMany({
            where: {
                id: { in: [...new Set(winnersBySeason.flatMap(x => x.winners))] }
            },
            select: {
                id: true,
                userDisplayName: true,
                isActive: true
            }
        });

        return winnersBySeason.map(item => ({
            season: item.season,
            maxScore: item.maxScore,
            participants: participants.filter(participant => item.winners.includes(participant.id))
        }));
    };

    const topByOverall = async (guildId: string, count: number) => {
        const groups = await database.games.groupBy({
            by: ["guildId", "winnerParticipantId"],
            where: {
                guildId,
                winnerParticipant: {
                    isActive: true
                }
            },
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: "desc"
                }
            },
            take: count
        });

        const participants = await database.participants.findMany({
            where: {
                id: {
                    in: groups.map(x => x.winnerParticipantId)
                }
            }
        });

        const top = groups.map(group => ({
            // biome-ignore lint/style/noNonNullAssertion: We already selected participants above
            participant: participants.find(participant => participant.id === group.winnerParticipantId)!,
            count: group._count.id
        }));

        if (top.length < count) {
            const other = await database.participants.findMany({
                where: {
                    guildId,
                    isActive: true,
                    id: {
                        notIn: groups.map(x => x.winnerParticipantId)
                    }
                },
                take: count - top.length
            });

            top.push(...other.map(participant => ({ participant, count: 0 })));
        }

        return top;
    };

    const topHostByCurrentSeason = async (guildId: string, count: number) => {
        const groups = await database.games.groupBy({
            by: ["guildId", "seasonId", "hostParticipantId"],
            where: {
                guildId,
                season: {
                    isActive: true
                },
                hostParticipant: {
                    isActive: true
                }
            },
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: "desc"
                }
            },
            take: count
        });

        const participants = await database.participants.findMany({
            where: {
                id: {
                    in: groups.map(x => x.hostParticipantId ?? -1)
                }
            }
        });

        const season = await database.seasons.findFirst({
            where: { guildId, isActive: true },
            select: { index: true }
        });

        const top = {
            number: (season?.index ?? 0) + 1,
            results: groups.map(group => ({
                // biome-ignore lint/style/noNonNullAssertion: We already selected participants above
                participant: participants.find(participant => participant.id === group.hostParticipantId)!,
                count: group._count.id
            }))
        };

        if (top.results.length < count) {
            const other = await database.participants.findMany({
                where: {
                    guildId,
                    isActive: true,
                    id: {
                        notIn: groups.map(x => x.hostParticipantId ?? -1)
                    }
                },
                take: count - top.results.length
            });

            top.results.push(...other.map(participant => ({ participant, count: 0 })));
        }

        return top;
    };

    const topHostBySeason = async (guildId: string, count: number) => {
        const seasons = await database.seasons.findMany({
            where: { guildId },
            orderBy: { timestamp: "desc" },
            select: { id: true, index: true, isActive: true },
            take: count
        });

        const hosts = await database.games.groupBy({
            by: ["seasonId", "hostParticipantId"],
            where: {
                seasonId: {
                    in: seasons.map(x => x.id)
                },
                hostParticipant: {
                    isActive: true
                }
            },
            _count: {
                id: true
            }
        });

        const hostsBySeason = seasons.map(season => {
            const seasonHosts = hosts.filter(host => host.seasonId === season.id);
            const maxScore = Math.max(...seasonHosts.map(host => host._count.id));

            return {
                season,
                maxScore,
                hosts: seasonHosts.filter(host => host._count.id === maxScore).map(host => host.hostParticipantId ?? -1)
            };
        });

        const participants = await database.participants.findMany({
            where: {
                id: { in: [...new Set(hostsBySeason.flatMap(x => x.hosts))] }
            },
            select: {
                id: true,
                userDisplayName: true,
                isActive: true
            }
        });

        return hostsBySeason.map(item => ({
            season: item.season,
            maxScore: item.maxScore,
            participants: participants.filter(participant => item.hosts.includes(participant.id))
        }));
    };

    const topHostByOverall = async (guildId: string, count: number) => {
        const groups = await database.games.groupBy({
            by: ["guildId", "hostParticipantId"],
            where: {
                guildId,
                hostParticipant: {
                    isActive: true
                }
            },
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: "desc"
                }
            },
            take: count
        });

        const participants = await database.participants.findMany({
            where: {
                id: {
                    in: groups.map(x => x.hostParticipantId ?? -1)
                }
            }
        });

        const top = groups.map(group => ({
            // biome-ignore lint/style/noNonNullAssertion: We already selected participants above
            participant: participants.find(participant => participant.id === group.hostParticipantId)!,
            count: group._count.id
        }));

        if (top.length < count) {
            const other = await database.participants.findMany({
                where: {
                    guildId,
                    isActive: true,
                    id: {
                        notIn: groups.map(x => x.hostParticipantId ?? -1)
                    }
                },
                take: count - top.length
            });

            top.push(...other.map(participant => ({ participant, count: 0 })));
        }

        return top;
    };

    const topHostWithWinnerByOverall = async (guildId: string) => {
        const groups = await database.games.groupBy({
            by: ["hostParticipantId", "winnerParticipantId"],
            where: {
                guildId,
                hostParticipant: {
                    isActive: true
                },
                winnerParticipant: {
                    isActive: true
                }
            },
            _count: {
                winnerParticipantId: true
            }
        });

        const participantIds = [
            ...new Set(groups.flatMap(x => [x.hostParticipantId, x.winnerParticipantId]).filter(x => x !== null))
        ];

        const participants = await database.participants.findMany({
            where: {
                id: {
                    in: participantIds.length > 0 ? participantIds : [-1]
                }
            },
            select: {
                id: true,
                userId: true,
                userDisplayName: true
            }
        });

        const players: Record<number, { userId: string; displayName: string }> = {};

        for (const participant of participants) {
            players[participant.id] = {
                userId: participant.userId,
                displayName: participant.userDisplayName
            };
        }

        return {
            games: groups.map(group => ({
                hostUserId: players[group.hostParticipantId as number].userId,
                winnerUserId: players[group.winnerParticipantId].userId,
                winnerScore: group._count.winnerParticipantId
            })),
            players: Object.fromEntries(Object.values(players).map(x => [x.userId, x.displayName]))
        };
    };

    return {
        get,
        add,
        update,
        addOrUpdate,
        all,
        topByOverall,
        topBySeason,
        topByCurrentSeason,
        topHostByOverall,
        topHostBySeason,
        topHostByCurrentSeason,
        topHostWithWinnerByOverall
    };
});

export { participants };
