/*
  Warnings:

  - You are about to drop the column `isInsuraceCompany` on the `RealCompany` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "isInsuranceCompany" AS ENUM ('კი', 'არა');

-- AlterTable
ALTER TABLE "RealCompany" DROP COLUMN "isInsuraceCompany",
ADD COLUMN     "isInsuranceCompany" "isInsuranceCompany" NOT NULL DEFAULT 'არა';

-- DropEnum
DROP TYPE "isInsuraceCompany";
