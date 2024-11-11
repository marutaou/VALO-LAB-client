/*
  Warnings:

  - You are about to drop the column `throw` on the `AirstrikePost` table. All the data in the column will be lost.
  - Added the required column `throwing` to the `AirstrikePost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirstrikePost" DROP COLUMN "throw",
ADD COLUMN     "throwing" TEXT NOT NULL;
