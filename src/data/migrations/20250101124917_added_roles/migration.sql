-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('UNKNOWN', 'WINNER');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "role_type" "RoleType" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);
