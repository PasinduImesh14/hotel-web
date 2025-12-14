/*
  Warnings:

  - A unique constraint covering the columns `[passportNumber]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nicNumber]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `passportNumber` VARCHAR(191) NULL,
    MODIFY `nicNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Customer_passportNumber_key` ON `Customer`(`passportNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `Customer_nicNumber_key` ON `Customer`(`nicNumber`);
