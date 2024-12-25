import { PrismaClient } from "@/data/generated/prisma-client";

type Database = typeof prisma;

const prisma = new PrismaClient();

const createRepository = <T extends object>(implementation: (database: Database) => T) => {
    return implementation(prisma);
};

export { createRepository };
export type { Database };
