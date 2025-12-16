-- CreateTable
CREATE TABLE "EventSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stall1Revealed" BOOLEAN NOT NULL DEFAULT false,
    "stall2Revealed" BOOLEAN NOT NULL DEFAULT false,
    "stall3Revealed" BOOLEAN NOT NULL DEFAULT false
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Registration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "stallId" TEXT NOT NULL,
    "stallName" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
    "amount" INTEGER NOT NULL DEFAULT 100,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Registration" ("createdAt", "email", "id", "name", "paymentStatus", "phone", "stallId", "stallName") SELECT "createdAt", "email", "id", "name", "paymentStatus", "phone", "stallId", "stallName" FROM "Registration";
DROP TABLE "Registration";
ALTER TABLE "new_Registration" RENAME TO "Registration";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
