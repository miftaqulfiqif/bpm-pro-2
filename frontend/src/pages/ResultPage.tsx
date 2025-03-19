import { useEffect, useState } from "react";
import { ItemsResult } from "../components/ItemsResult";
import ChartHeartRate from "../components/ChartHeartRate";

export const ResultPage = () => {
  const [systolic, setSystolic] = useState("--");
  const [diastolic, setDiastolic] = useState("--");
  const [mean, setMean] = useState("--");
  const [heartRate, setHeartRate] = useState("--");

  useEffect(() => {
    setSystolic("120");
    setDiastolic("80");
    setMean("90");
    setHeartRate("100");
  }, []);

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
        <ChartHeartRate />
      </div>
    </div>
  );
};
