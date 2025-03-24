/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "phone" INTEGER NOT NULL,
    "work" VARCHAR(50) NOT NULL,
    "last_education" VARCHAR(50) NOT NULL,
    "place_of_birth" VARCHAR(50) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
