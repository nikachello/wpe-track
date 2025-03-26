/*
  Warnings:

  - The `isInsuranceCompany` column on the `RealCompany` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[realCompanyId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `realCompanyId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "realCompanyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RealCompany" DROP COLUMN "isInsuranceCompany",
ADD COLUMN     "isInsuranceCompany" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Company_realCompanyId_key" ON "Company"("realCompanyId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_realCompanyId_fkey" FOREIGN KEY ("realCompanyId") REFERENCES "RealCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
