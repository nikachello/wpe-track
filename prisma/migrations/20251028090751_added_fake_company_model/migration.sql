-- CreateTable
CREATE TABLE "FakeCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "cityStateZip" TEXT NOT NULL,
    "mcNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "FakeCompany_pkey" PRIMARY KEY ("id")
);
