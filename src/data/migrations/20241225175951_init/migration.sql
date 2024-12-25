-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_display_name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "winner_participant_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winner_participant_id_fkey" FOREIGN KEY ("winner_participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
