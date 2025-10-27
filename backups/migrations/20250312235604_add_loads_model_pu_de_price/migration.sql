/*
  Warnings:

  - Added the required column `deliveryAddress` to the `Load` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddress` to the `Load` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Load` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vin` to the `Load` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Load" ADD COLUMN     "deliveryAddress" TEXT NOT NULL,
ADD COLUMN     "pickupAddress" TEXT NOT NULL,
ADD COLUMN     "price" TEXT NOT NULL,
ADD COLUMN     "vin" TEXT NOT NULL;
