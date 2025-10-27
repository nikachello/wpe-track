-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "email" TEXT,
ADD COLUMN     "telegramId" TEXT;

-- AlterTable
ALTER TABLE "Load" ADD COLUMN     "isDelivered" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RealDriver" ADD COLUMN     "percentage" TEXT,
ADD COLUMN     "trailerSize" TEXT;
