/*
  Warnings:

  - You are about to drop the column `adults` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `beds` on the `room` table. All the data in the column will be lost.
  - Added the required column `balcony` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clothRack` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dryingRack` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fan` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gardenView` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iron` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locker` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sittingArea` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tv` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_roomId_fkey`;

-- AlterTable
ALTER TABLE `room` DROP COLUMN `adults`,
    DROP COLUMN `beds`,
    ADD COLUMN `balcony` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `clothRack` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `cost` DOUBLE NOT NULL,
    ADD COLUMN `dryingRack` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `fan` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `gardenView` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `iron` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `locker` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `offer` DOUBLE NULL,
    ADD COLUMN `parking` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `sittingArea` ENUM('YES', 'NO') NOT NULL,
    ADD COLUMN `tv` ENUM('YES', 'NO') NOT NULL;

-- CreateTable
CREATE TABLE `Bedroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `bedType` ENUM('SINGLE', 'DOUBLE', 'QUEEN', 'KING', 'TWIN', 'DOUBLE_ROOM', 'TRIPLE', 'FAMILY') NOT NULL,
    `count` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bathroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `shower` ENUM('YES', 'NO') NOT NULL,
    `slipper` ENUM('YES', 'NO') NOT NULL,
    `soap` ENUM('YES', 'NO') NOT NULL,
    `bidet` ENUM('YES', 'NO') NOT NULL,
    `towels` ENUM('YES', 'NO') NOT NULL,
    `toiletPaper` ENUM('YES', 'NO') NOT NULL,
    `hotWater` ENUM('YES', 'NO') NOT NULL,
    `privateBathroom` ENUM('YES', 'NO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kitchen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `diningTable` ENUM('YES', 'NO') NOT NULL,
    `gasCooker` ENUM('YES', 'NO') NOT NULL,
    `riceCooker` ENUM('YES', 'NO') NOT NULL,
    `woodStove` ENUM('YES', 'NO') NOT NULL,
    `fridge` ENUM('YES', 'NO') NOT NULL,
    `electricKettle` ENUM('YES', 'NO') NOT NULL,
    `waterBottle` ENUM('YES', 'NO') NOT NULL,

    UNIQUE INDEX `Kitchen_roomId_key`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bedroom` ADD CONSTRAINT `Bedroom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bathroom` ADD CONSTRAINT `Bathroom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kitchen` ADD CONSTRAINT `Kitchen_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
