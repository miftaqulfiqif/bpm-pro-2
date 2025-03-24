-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "user_id" SET DEFAULT 'default_user_id';

-- CreateTable
CREATE TABLE "patient_measurements" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "weight" VARCHAR(10) NOT NULL,
    "systolic" DOUBLE PRECISION NOT NULL,
    "diastolic" DOUBLE PRECISION NOT NULL,
    "mean" DOUBLE PRECISION NOT NULL,
    "heart_rate" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_measurements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_measurements" ADD CONSTRAINT "patient_measurements_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
