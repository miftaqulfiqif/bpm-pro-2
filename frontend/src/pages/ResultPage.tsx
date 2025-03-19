import { useEffect, useState } from "react";
import { ItemsResult } from "../components/ItemsResult";
import ChartHeartRate from "../components/ChartHeartRate";
import { useCounter } from "../hooks/Counter";

export const ResultPage = () => {
  const { buttonStart, buttonStop, buttonLoading, items, result } =
    useCounter();

  const [systolic, setSystolic] = useState("--");
  const [diastolic, setDiastolic] = useState("--");
  const [mean, setMean] = useState("--");
  const [heartRate, setHeartRate] = useState("--");

  console.log(result);

  useEffect(() => {}, []);

  return (
    <div className="h-screen w-screen bg-gray-500 px-20">
      <div className="flex flex-col bg-white rounded-xl p-4 gap-8">
        <p className="font-bold">Your healt statistic</p>
        <div className="bg-gray-200 h-[200px] w-[200px] mx-auto"></div>
        <div className="flex justify-between mx-10">
          <ItemsResult title="Systolic" value={systolic} unit="mmHg" />
          <ItemsResult title="Diastolic" value={diastolic} unit="mmHg" />
          <ItemsResult title="Mean" value={mean} unit="mmHg" />
          <ItemsResult title="Heart Rate" value={heartRate} unit="bpm" />
        </div>
        <div className="flex gap-4">
          <button
            disabled={buttonLoading}
            onClick={buttonStart}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded w-full disabled:opacity-50"
          >
            Start
          </button>
          <button
            onClick={buttonStop}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
          >
            Stop
          </button>
        </div>
        <ChartHeartRate items={items} />
      </div>
    </div>
  );
};
