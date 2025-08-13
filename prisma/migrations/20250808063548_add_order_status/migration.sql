-- AlterTable
ALTER TABLE `order` ADD COLUMN `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending';
