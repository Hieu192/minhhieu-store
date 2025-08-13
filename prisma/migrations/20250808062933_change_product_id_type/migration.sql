/*
  Warnings:

  - You are about to alter the column `productId` on the `orderitem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `orderitem` MODIFY `productId` INTEGER NOT NULL;
