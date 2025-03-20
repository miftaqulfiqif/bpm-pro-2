import { useEffect, useState } from "react";
import { ItemsResult } from "../components/ItemsResult";
import ChartHeartRate from "../components/ChartHeartRate";
import { useCounter } from "../hooks/Counter";

import heartImg from "../assets/images/heart.png";

import bloodIcon from "../assets/icons/blood-icon.jpg";
import hyperTensionIcon from "../assets/icons/hypertension.png";
import bloodPressureIcon from "../assets/icons/blood-pressure.png";
import bloodPressure2Icon from "../assets/icons/blood-pressure-icon.png";
export const ResultPage = () => {
  const {
    buttonStart,
    start,
    message,
    buttonStop,
    buttonLoading,
    items,
    result,
  } = useCounter();

  const [systolic, setSystolic] = useState<number>(0);
  const [diastolic, setDiastolic] = useState<number>(0);
  const [mean, setMean] = useState<number>(0);
  const [heartRate, setHeartRate] = useState<number>(0);

  useEffect(() => {
    if (result) {
      setSystolic(result.systolic);
      setDiastolic(result.diastolic);
      setMean(result.mean);
      setHeartRate(result.heart_rate);
    }
  }, [result]);

  return (
    <div className="h-screen w-screen bg-[#E7E7E7] px-20 py-10">
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-col text-4xl lg:w-1/2 gap-2">
          <p className="font-bold">Overview</p>
          <p className="">Patient Health</p>
          <img src={heartImg} alt="" />
        </div>
        <div className="flex flex-col gap-8 lg:w-1/2 bg-slate-100 p-10 rounded-4xl">
          <div className="flex flex-col bg-white rounded-3xl p-10 gap-10 shadow-xl">
            <p>Result</p>
            <div className="flex justify-between">
              <ItemsResult
                icon={bloodIcon}
                title="Systolic"
                value={systolic}
                unit="mmHg"
              />
              <ItemsResult
                icon={bloodPressureIcon}
                title="Diastolic"
                value={diastolic}
                unit="mmHg"
              />
              <ItemsResult
                icon={bloodPressure2Icon}
                title="Mean"
                value={mean}
                unit="mmHg"
              />
              <ItemsResult
                icon={hyperTensionIcon}
                title="Heart Rate"
                value={heartRate}
                unit="bpm"
              />
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="w-fit">
              <ChartHeartRate items={items} />
            </div>
          </div>
          <div className="flex gap-4 text-white font-bold tracking-wider justify-around">
            <button
              disabled={buttonLoading}
              onClick={buttonStart}
              className="px-8 py-4 bg-blue-700  rounded-full w-xs shadow-xl disabled:opacity-50"
            >
              START
            </button>
            <button
              onClick={buttonStop}
              className="px-8 py-4 bg-red-500  rounded-full w-xs shadow-xl"
            >
              STOP
            </button>
          </div>
          <div
            className={`fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 z-40 ${
              start ? "" : "hidden"
            }`}
            style={{ backdropFilter: "blur(5px)" }} // Menambahkan efek blur jika diinginkan
          >
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-10 z-50">
              <div className="flex flex-col gap-4">
                <p className="text-2xl font-semibold">
                  Press Start Button at BPM PRO 2
                </p>
                <p className="text-center">{message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
