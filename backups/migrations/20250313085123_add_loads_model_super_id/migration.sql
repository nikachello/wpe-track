/*
  Warnings:

  - Added the required column `superId` to the `Load` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Load" ADD COLUMN     "superId" TEXT NOT NULL;
