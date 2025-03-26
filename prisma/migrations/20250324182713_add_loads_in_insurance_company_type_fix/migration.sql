/*
  Warnings:

  - You are about to drop the column `isinsuraceCompany` on the `RealCompany` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RealCompany" DROP COLUMN "isinsuraceCompany",
ADD COLUMN     "isInsuraceCompany" "isinsuraceCompany" NOT NULL DEFAULT 'არა';
