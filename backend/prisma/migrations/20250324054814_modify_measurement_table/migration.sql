-- AlterTable
ALTER TABLE "measurements" ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "user_id" SET DEFAULT 'default_user_id',
ADD CONSTRAINT "measurements_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "user_id" SET DEFAULT 'defaul_user_id',
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);
