/*
  Warnings:

  - You are about to drop the column `invitedId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_invitedId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_groupId_fkey";

-- DropIndex
DROP INDEX "Group_adminId_key";

-- DropIndex
DROP INDEX "Group_invitedId_key";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "invitedId";

-- DropTable
DROP TABLE "Member";

-- CreateTable
CREATE TABLE "_invitedGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_invitedGroups_AB_unique" ON "_invitedGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_invitedGroups_B_index" ON "_invitedGroups"("B");

-- AddForeignKey
ALTER TABLE "_invitedGroups" ADD CONSTRAINT "_invitedGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invitedGroups" ADD CONSTRAINT "_invitedGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
