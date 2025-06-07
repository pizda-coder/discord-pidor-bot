/*
  Warnings:

  - Made the column `season_id` on table `games` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "games" ALTER COLUMN "season_id" SET NOT NULL;
