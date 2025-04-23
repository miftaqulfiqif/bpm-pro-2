import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

// Tipe untuk data measurement (dari API)
interface Measurement {
  id: number;
  systolic: number;
  diastolic: number;
  timestamp: string;
}

// Tipe untuk data chart (yang akan digunakan untuk chart)
interface ChartData {
  month: string;
  systolic: number;
  diastolic: number;
}

export const useHistoryMeasurement = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const fetchAndFormatData = async (idPatient: string): Promise<void> => {
    try {
      const response = await axios.get<{ data: Measurement[] }>(
        `http://localhost:3000/api/history-measurement/${idPatient}`,
        {
          withCredentials: true,
        }
      );

      const rawData = response.data.data;

      const sortedData = rawData
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
        .slice(-10);

      const formattedChartData: ChartData[] = sortedData.map((entry) => ({
        month: dayjs(entry.timestamp).format("D MMMM"),
        systolic: entry.systolic,
        diastolic: entry.diastolic,
      }));

      setChartData(formattedChartData);
      console.log("Formatted Chart Data:", formattedChartData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return { chartData, fetchAndFormatData };
};
