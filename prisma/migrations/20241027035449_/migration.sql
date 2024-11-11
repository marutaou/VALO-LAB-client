/*
  Warnings:

  - You are about to drop the column `charege` on the `AirstrikePost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AirstrikePost" DROP COLUMN "charege",
ADD COLUMN     "charge" TEXT;
