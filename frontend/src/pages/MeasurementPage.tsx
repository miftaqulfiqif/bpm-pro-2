import Page from "@/components/layouts/main-layout.tsx";
import { useEffect, useState } from "react";
import { ItemsResult } from "../components/ItemsResult";
import ChartHeartRate from "../components/ChartHeartRate";
import { useCounter } from "../hooks/Counter";

import heartImg from "../assets/images/heart.png";

import bloodIcon from "../assets/icons/blood-icon.jpg";
import hyperTensionIcon from "../assets/icons/hypertension.png";
import bloodPressureIcon from "../assets/icons/blood-pressure.png";
import bloodPressure2Icon from "../assets/icons/blood-pressure-icon.png";
import { CreateNewPatient } from "../components/Forms/CreateNewPatient";
import { PressButtonModal } from "@/components/PressButtonModal";
import axios from "axios";
import { paginationClasses } from "@mui/material";

type PatientProps = {
  name: string;
  gender: string;
  phone: string;
  work: string;
  last_education: string;
  place_of_birth: string;
  date_of_birth: string;
};

export default function MeasurementPage(props: PatientProps) {
  const { start, buttonStart, buttonStop, buttonLoading, items, result } =
    useCounter();

  const [patient, setPatient] = useState<PatientProps>();
  const [isScaled, setIsScaled] = useState(false);
  const [systolic, setSystolic] = useState<number>(0);
  const [diastolic, setDiastolic] = useState<number>(0);
  const [mean, setMean] = useState<number>(0);
  const [heartRate, setHeartRate] = useState<number>(0);

  const token = "dbcd07c1-b64e-4e7a-ba48-814f3931c691";

  const [form, setForm] = useState(false);

  const openForm = () => {
    setForm(true);
  };

  const closeForm = () => {
    setForm(false);
  };

  const handleSaveResult = async () => {
    try {
      const patientResponse = await axios.post(
        "http://localhost:3000/api/patients",
        {
          name: patient?.name,
          gender: patient?.gender,
          phone: patient?.phone,
          work: patient?.work,
          last_education: patient?.last_education,
          place_of_birth: patient?.place_of_birth,
          date_of_birth: patient?.date_of_birth,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(patientResponse);

      await axios
        .post(
          "http://localhost:3000/api/patient-measurement",
          {
            patient_id: patientResponse.data.data.id,
            weight: 95,
            systolic: result.systolic,
            diastolic: result.diastolic,
            mean: result.mean,
            heart_rate: result.heart_rate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
        });

      console.log("Data saved successfully");
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (result) {
      setSystolic(result.systolic);
      setDiastolic(result.diastolic);
      setMean(result.mean);
      setHeartRate(result.heart_rate);
    }

    const interval = setInterval(() => {
      setIsScaled(true);
      setTimeout(() => {
        setIsScaled(false);
      }, 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [result, items]);

  return (
    <Page>
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-col text-4xl lg:w-1/2 gap-2">
          <p className="font-bold">Overview</p>
          <p className="">Patient Health</p>
          <img
            src={heartImg}
            alt=""
            className={`transition-all duration-150 ${
              isScaled ? "scale-95" : "scale-90"
            }`}
          />
        </div>
        <div className="flex flex-col gap-8 lg:w-1/2 bg-slate-100 p-10 rounded-4xl">
          <div className="flex flex-col bg-white rounded-3xl p-10 gap-10 shadow-xl">
            <div className="relative">
              <div className="absolute h-10 w-10 bg-gray-900 rounded-full shadow-2xl overflow-hidden">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFx3lKwgA58n-EQE8MFAMkUSRW_3Ma6d22ww&s"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                className=" h-10 w-fit
              pl-14 pr-8 bg-[#D9D9D9] rounded-full flex items-center text-center"
              >
                <p className="font-semibold">{patient?.name}</p>
              </div>
            </div>
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
          <div className="flex gap-4 font-bold tracking-wider justify-around">
            {buttonLoading ? (
              <button
                onClick={buttonStop}
                className="px-8 py-4 bg-red-500 text-white rounded-full w-xs shadow-xl"
              >
                STOP
              </button>
            ) : result.diastolic === 0 ? (
              <button
                disabled={buttonLoading}
                onClick={openForm}
                className="px-8 py-4 bg-white text-blue-700 border-blue-700 border-2 rounded-full w-xs shadow-xl disabled:opacity-50 hover:bg-slate-100"
              >
                START
              </button>
            ) : (
              <button
                onClick={handleSaveResult}
                className="px-8 py-4 bg-white text-blue-700 border-blue-700 border-2 rounded-full w-xs shadow-xl disabled:opacity-50 hover:bg-slate-100"
              >
                SAVE
              </button>
            )}
          </div>

          {/* <PressButtonModal start={start} message={message} /> */}
        </div>
        <CreateNewPatient
          form={form}
          closeModal={closeForm}
          setPatient={setPatient}
          buttonStart={buttonStart}
          buttonLoading={buttonLoading}
          start={start}
        />
      </div>
    </Page>
  );
}
