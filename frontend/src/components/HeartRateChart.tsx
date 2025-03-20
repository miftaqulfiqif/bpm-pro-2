import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function BasicLineChart() {
  const [dataChart, setDataChart] = useState<number[]>([]);

  useEffect(() => {
    setDataChart((prevData) => [...prevData, 0]); // Menambahkan data baru dengan aman
    // Setiap 1 detik, data baru ditambahkan

    // Cleanup interval saat komponen unmount
  }, []);

  console.log(dataChart);

  return (
    <div>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10, 20] }]}
        series={[{ data: dataChart }]}
        width={700}
        height={300}
      />
    </div>
  );
}
