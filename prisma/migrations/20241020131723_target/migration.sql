/*
  Warnings:

  - Added the required column `targetId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetId` to the `Reply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "targetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "targetId" INTEGER NOT NULL;
