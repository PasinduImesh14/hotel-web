-- DropForeignKey
ALTER TABLE `otherdetails` DROP FOREIGN KEY `OtherDetails_bookingId_fkey`;

-- AddForeignKey
ALTER TABLE `OtherDetails` ADD CONSTRAINT `OtherDetails_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
