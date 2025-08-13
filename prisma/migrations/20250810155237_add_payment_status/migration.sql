/*
  Warnings:

  - You are about to drop the column `paidStatus` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `paidStatus`,
    ADD COLUMN `paymentStatus` ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending';
