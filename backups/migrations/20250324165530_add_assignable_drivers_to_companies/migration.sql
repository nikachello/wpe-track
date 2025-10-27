-- CreateTable
CREATE TABLE "AssignableDrivers" (
    "driverId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "AssignableDrivers_pkey" PRIMARY KEY ("driverId","companyId")
);

-- AddForeignKey
ALTER TABLE "AssignableDrivers" ADD CONSTRAINT "AssignableDrivers_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignableDrivers" ADD CONSTRAINT "AssignableDrivers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
