/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Opd` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Opd" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Opd_slug_key" ON "Opd"("slug");
