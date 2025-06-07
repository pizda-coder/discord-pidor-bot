-- AlterTable
ALTER TABLE "seasons" ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "season_end_votes" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "season_end_votes_pkey" PRIMARY KEY ("id")
);
