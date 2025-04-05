-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
