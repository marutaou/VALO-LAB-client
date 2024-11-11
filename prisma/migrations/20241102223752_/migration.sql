/*
  Warnings:

  - The `fallingPinX` column on the `AirstrikePost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fallingPinY` column on the `AirstrikePost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `firingPinX` column on the `AirstrikePost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `firingPinY` column on the `AirstrikePost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AirstrikePost" DROP COLUMN "fallingPinX",
ADD COLUMN     "fallingPinX" DOUBLE PRECISION,
DROP COLUMN "fallingPinY",
ADD COLUMN     "fallingPinY" DOUBLE PRECISION,
DROP COLUMN "firingPinX",
ADD COLUMN     "firingPinX" DOUBLE PRECISION,
DROP COLUMN "firingPinY",
ADD COLUMN     "firingPinY" DOUBLE PRECISION;
