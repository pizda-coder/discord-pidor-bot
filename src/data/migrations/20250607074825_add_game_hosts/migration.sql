-- AlterTable
ALTER TABLE "games" ADD COLUMN     "host_participant_id" INTEGER;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_host_participant_id_fkey" FOREIGN KEY ("host_participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
