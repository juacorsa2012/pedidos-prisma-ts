/*
  Warnings:

  - You are about to alter the column `nombre` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "clientes" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(50);
