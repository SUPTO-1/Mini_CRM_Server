/*
  Warnings:

  - Changed the type of `type` on the `Interaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `notes` on table `Interaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('CALL', 'MEETING', 'EMAIL');

-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "type",
ADD COLUMN     "type" "InteractionType" NOT NULL,
ALTER COLUMN "notes" SET NOT NULL;
