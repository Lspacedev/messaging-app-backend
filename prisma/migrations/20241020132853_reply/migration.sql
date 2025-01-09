/*
  Warnings:

  - You are about to drop the column `targetId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `Reply` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_authorId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "targetId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "targetId";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
