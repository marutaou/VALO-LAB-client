/*
  Warnings:

  - Added the required column `fallingPinX` to the `AirstrikePost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fallingPinY` to the `AirstrikePost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firingPinX` to the `AirstrikePost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firingPinY` to the `AirstrikePost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirstrikePost" ADD COLUMN     "fallingPinX" TEXT NOT NULL,
ADD COLUMN     "fallingPinY" TEXT NOT NULL,
ADD COLUMN     "firingPinX" TEXT NOT NULL,
ADD COLUMN     "firingPinY" TEXT NOT NULL;
