import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const bloodPressureCategories = [
  // NORMAL
  {
    name: "Normal",
    gender: "male",
    is_age_required: true,
    min_age: 18,
    max_age: 40,
    min_systolic: 90,
    max_systolic: 120,
    min_diastolic: 60,
    max_diastolic: 80,
    color: "#00FF6F", // hijau
    description: "Tekanan darah normal untuk pria usia 18-40 tahun",
  },
  {
    name: "Normal",
    gender: "female",
    is_age_required: true,
    min_age: 18,
    max_age: 40,
    min_systolic: 90,
    max_systolic: 125,
    min_diastolic: 60,
    max_diastolic: 80,
    color: "#00FF6F",
    description: "Tekanan darah normal untuk wanita usia 18-40 tahun",
  },

  // ELEVATED
  {
    name: "Elevated",
    gender: "any",
    is_age_required: true,
    min_age: 18,
    max_age: 60,
    min_systolic: 121,
    max_systolic: 129,
    min_diastolic: 60,
    max_diastolic: 80,
    color: "#FFE500", // kuning
    description: "Tekanan darah sedikit di atas normal",
  },

  // HYPERTENSION STAGE 1
  {
    name: "Hypertension Stage 1",
    gender: "any",
    is_age_required: true,
    min_age: 18,
    max_age: 60,
    min_systolic: 130,
    max_systolic: 139,
    min_diastolic: 80,
    max_diastolic: 89,
    color: "#FF6600", // oranye
    description: "Hipertensi tahap awal",
  },

  // HYPERTENSION STAGE 2
  {
    name: "Hypertension Stage 2",
    gender: "any",
    is_age_required: true,
    min_age: 18,
    max_age: 100,
    min_systolic: 140,
    max_systolic: 180,
    min_diastolic: 90,
    max_diastolic: 120,
    color: "#FF0000", // merah
    description: "Hipertensi tahap dua",
  },

  // HYPERTENSIVE CRISIS
  {
    name: "Hypertensive Crisis",
    gender: "any",
    is_age_required: false,
    min_age: 0,
    max_age: 0,
    min_systolic: 181,
    max_systolic: 300,
    min_diastolic: 121,
    max_diastolic: 200,
    color: "#FF0000", // merah gelap
    description: "Krisis hipertensi, butuh penanganan segera",
  },
];

async function main() {
  const defaultUser = await prisma.user.upsert({
    where: { id: "admin" },
    update: {},
    create: {
      id: "admin",
      name: "Admin",
      username: "admin",
      password: "password",
    },
  });

  for (const category of bloodPressureCategories) {
    await prisma.defaultCategoryResult.upsert({
      where: {
        gender_min_age_max_age_min_systolic_max_systolic_min_diastolic_max_diastolic:
          {
            gender: category.gender,
            min_age: category.min_age,
            max_age: category.max_age,
            min_systolic: category.min_systolic,
            max_systolic: category.max_systolic,
            min_diastolic: category.min_diastolic,
            max_diastolic: category.max_diastolic,
          },
      },
      update: {},
      create: {
        user_id: defaultUser.id,
        ...category,
      },
    });
  }

  console.log("✅ Seeding selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
