-- CreateEnum
CREATE TYPE "User_State" AS ENUM ('available', 'unavailable', 'blocked');

-- CreateEnum
CREATE TYPE "User_Role" AS ENUM ('admin', 'wh', 'sale', 'hr', 'other');

-- CreateEnum
CREATE TYPE "Ingredient_Unit" AS ENUM ('g', 'kg', 'l', 'ml', 'the');

-- CreateEnum
CREATE TYPE "Food_State" AS ENUM ('onsale', 'available', 'unavailable');

-- CreateEnum
CREATE TYPE "Food_Cat" AS ENUM ('new', 'combo4one', 'combo4group', 'chicken', 'carb', 'snack', 'drink', 'desert', 'other');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "username" STRING NOT NULL,
    "password" STRING NOT NULL,
    "state" "User_State" NOT NULL DEFAULT 'unavailable',
    "role" "User_Role" NOT NULL DEFAULT 'other',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "phone" STRING,
    "supplierId" UUID,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "unit" "Ingredient_Unit" NOT NULL DEFAULT 'the',
    "supplierId" UUID,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "sale_price" DECIMAL(65,30) NOT NULL,
    "img" STRING,
    "description" STRING,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "Food_State" NOT NULL DEFAULT 'available',
    "category" "Food_Cat" NOT NULL DEFAULT 'other',

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodIngredient" (
    "foodId" UUID NOT NULL,
    "ingredientId" UUID NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "FoodIngredient_pkey" PRIMARY KEY ("foodId","ingredientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodIngredient" ADD CONSTRAINT "FoodIngredient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodIngredient" ADD CONSTRAINT "FoodIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
