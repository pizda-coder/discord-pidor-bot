-- AlterTable
ALTER TABLE "games" ADD COLUMN     "season_id" INTEGER;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
