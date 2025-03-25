function classifyBloodPressure(systolic, diastolic, age, gender) {
  // Aturan umum untuk klasifikasi tekanan darah
  let classification = "";

  // Normal
  if (systolic < 120 && diastolic < 80) {
    classification = "Normal";
  }
  // Prehipertensi
  else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
    classification = "Prehipertensi";
  }
  // Hipertensi Tingkat 1
  else if (
    (systolic >= 130 && systolic <= 139) ||
    (diastolic >= 80 && diastolic <= 89)
  ) {
    classification = "Hipertensi Tingkat 1";
  }
  // Hipertensi Tingkat 2
  else if (systolic >= 140 || diastolic >= 90) {
    classification = "Hipertensi Tingkat 2";
  }
  // Krisis Hipertensi
  else if (systolic > 180 || diastolic > 120) {
    classification = "Krisis Hipertensi";
  }

  // Sesuaikan klasifikasi berdasarkan usia dan jenis kelamin
  // Misalnya, untuk usia lebih tua, sedikit lebih tinggi tekanan darah dianggap normal
  if (age >= 60) {
    if (classification === "Normal") {
      classification = "Normal (Usia Lanjut)";
    } else if (classification === "Prehipertensi") {
      classification = "Normal (Usia Lanjut)";
    }
  }

  if (gender === "female" && age >= 50) {
    // Wanita usia lanjut sering mengalami peningkatan tekanan darah
    if (classification === "Normal") {
      classification = "Normal (Wanita Usia Lanjut)";
    }
  }

  return classification;
}
