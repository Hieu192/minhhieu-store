-- AlterTable
ALTER TABLE `order` ADD COLUMN `paidStatus` ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending';
