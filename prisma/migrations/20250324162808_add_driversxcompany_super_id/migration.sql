/*
  Warnings:

  - Added the required column `superId` to the `DriversOnCompany` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DriversOnCompany" ADD COLUMN     "superId" TEXT NOT NULL;
