-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "token" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurements" (
    "user_id" VARCHAR(100) NOT NULL,
    "systolic" DOUBLE PRECISION NOT NULL,
    "diastolic" DOUBLE PRECISION NOT NULL,
    "mean" DOUBLE PRECISION NOT NULL,
    "heart_rate" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "measurements_user_id_key" ON "measurements"("user_id");
