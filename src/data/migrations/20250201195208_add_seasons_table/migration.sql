/*
  Warnings:

  - You are about to drop the column `season_index` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "season_index";

-- CreateTable
CREATE TABLE "seasons" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);
