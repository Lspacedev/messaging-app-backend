/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invitedId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Group_adminId_key" ON "Group"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_invitedId_key" ON "Group"("invitedId");
