/*
  Warnings:

  - You are about to drop the column `img` on the `FoodItem` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Facility_State" AS ENUM ('available', 'unavailable', 'issues');

-- AlterEnum
ALTER TYPE "Food_Cat"ADD VALUE 'dessert_drink';

-- AlterTable
ALTER TABLE "FoodItem" DROP COLUMN "img";
ALTER TABLE "FoodItem" ADD COLUMN     "image" STRING;

-- CreateTable
CREATE TABLE "Facility" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "amount" DECIMAL(65,30) NOT NULL,
    "issue_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "state" "Facility_State" NOT NULL DEFAULT 'available',
    "supplierId" UUID,
    "image" STRING,
    "unit" "Ingredient_Unit" NOT NULL DEFAULT 'the',

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
