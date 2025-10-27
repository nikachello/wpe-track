/*
  Warnings:

  - The `isInsuraceCompany` column on the `RealCompany` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "isInsuraceCompany" AS ENUM ('კი', 'არა');

-- AlterTable
ALTER TABLE "RealCompany" DROP COLUMN "isInsuraceCompany",
ADD COLUMN     "isInsuraceCompany" "isInsuraceCompany" NOT NULL DEFAULT 'არა';

-- DropEnum
DROP TYPE "isinsuraceCompany";
