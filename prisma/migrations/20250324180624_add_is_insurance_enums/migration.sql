/*
  Warnings:

  - The `isinsuraceCompany` column on the `RealCompany` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "isinsuraceCompany" AS ENUM ('კი', 'არა');

-- AlterTable
ALTER TABLE "RealCompany" DROP COLUMN "isinsuraceCompany",
ADD COLUMN     "isinsuraceCompany" "isinsuraceCompany" NOT NULL DEFAULT 'არა';
