/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Interaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "createdAt",
ALTER COLUMN "notes" DROP NOT NULL;
