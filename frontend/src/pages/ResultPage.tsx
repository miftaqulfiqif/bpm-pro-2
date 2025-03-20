import { useState } from "react";
import { ResultItems } from "../components/ResultItems";
import BasicLineChart from "../components/HeartRateChart";
import { useCounter } from "../hooks/Counter";

export const ResultPage = () => {
  const { result } = useCounter();

  const [systolic, setSystolic] = useState("--");
  const [diastolic, setDiastolic] = useState("--");
  const [mean, setMean] = useState("--");
  const [heartRate, setHeartRate] = useState("--");

  return (
    <div className="w-screen h-screen bg-gray-600 text-black flex justify-center items-center">
      <div className="flex flex-col w-[800px] bg-white p-10 rounded-2xl gap-8">
        <p className="text-2xl font-semibold">Your Heart Statistic</p>
        <div className="w-[300px] h-[300px] bg-gray-300 mx-auto"></div>
        <div className="flex justify-between">
          <ResultItems title="Systolic" value={systolic} />
          <ResultItems title="Diastolic" value={diastolic} />
          <ResultItems title="Mean" value={mean} />
          <ResultItems title="Heart Rate" value={heartRate} />
        </div>
        <BasicLineChart />
      </div>
    </div>
  );
};
