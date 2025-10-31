-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "summary" DROP NOT NULL,
ALTER COLUMN "thumbnail" DROP NOT NULL;
