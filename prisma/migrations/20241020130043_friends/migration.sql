/*
  Warnings:

  - You are about to drop the column `username` on the `Friend` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendId_fkey";

-- DropIndex
DROP INDEX "Friend_username_key";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "username",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
