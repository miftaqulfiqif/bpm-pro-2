import { useEffect, useState } from "react";
import { ItemsResult } from "../components/ItemsResult";
import ChartHeartRate from "../components/ChartHeartRate";
import { useCounter } from "../hooks/Counter";

import bloodPressureImg from "../assets/images/blood_pressure.png";
import bpmPro2Img from "../assets/images/bpmpro2.jpeg";

import bloodIcon from "../assets/icons/blood-icon.png";
import hyperTensionIcon from "../assets/icons/hypertension.png";
import bloodPressureIcon from "../assets/icons/blood-pressure.png";
import bloodPressure2Icon from "../assets/icons/blood-pressure-icon.png";
import { CreateNewPatient } from "../components/Forms/CreateNewPatient";
import axios from "axios";
import MainLayout from "@/components/layouts/main-layout.tsx";
import { SelectPatient } from "@/components/SelectPatient";
import { Patients } from "@/models/Patients";
import { toast } from "sonner";
import { duration } from "@mui/material";

export default function MeasurementPage() {
  const {
    start,
    buttonStart,
    buttonStop,
    buttonLoading,
    items,
    result,
    clearResult,
    categoryResult,
    categoryColor,
    token,
  } = useCounter();

  const [patient, setPatient] = useState<Patients | null>();
  const [isScaled, setIsScaled] = useState(false);
  const [systolic, setSystolic] = useState<number>(0);
  const [diastolic, setDiastolic] = useState<number>(0);

  const [isToast, setIsToast] = useState(false);

  const [mean, setMean] = useState<number>(0);
  const [heartRate, setHeartRate] = useState<number>(0);

  const [form, setForm] = useState(false);
  const [formSelectPatient, setFormSelectPatient] = useState(false);

  const [animatePage, setAnimatePage] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatePage(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const openForm = () => {
    setForm(true);
    setFormSelectPatient(false);
  };

  const openFormSelectPatient = () => {
    setFormSelectPatient(true);
    setForm(false);
  };
  const closeForm = () => {
    setForm(false);
  };
  const closeFormSelectPatient = () => {
    setFormSelectPatient(false);
  };

  const handleSaveResult = async () => {
    try {
      let patientResponse = null;
      if (!patient?.id) {
        patientResponse = await axios.post(
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
            withCredentials: true,
          }
        );
      }

      await axios
        .post(
          "http://localhost:3000/api/patient-measurements",
          {
            patient_id: patientResponse?.data.data.id || patient?.id,
            weight: 95,
            systolic: result.systolic,
            diastolic: result.diastolic,
            mean: result.mean,
            heart_rate: result.heart_rate,
            category_result: categoryResult?.name,
            category_color: categoryResult?.color,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status == 200) {
            toast.success("Patient measurement saved successfully", {
              duration: 2000,
            });
            setIsSaved(true);
          } else {
            toast.error("Error saving patient measurement, please try again", {
              duration: 2000,
            });
          }
          console.log(response);
        });
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

    // const interval = setInterval(() => {
    //   setIsScaled(true);
    //   setTimeout(() => {
    //     setIsScaled(false);
    //   }, 100);
    // }, 1000);

    // return () => clearInterval(interval);
  }, [result, items]);

  return (
    <MainLayout title="Measurement">
      <div className="flex flex-col lg:flex-row gap-10">
        <div
          className={`flex flex-col text-4xl lg:w-1/2 justify-between transform transition-all duration-700 ease-out ${
            animatePage
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col gap-2 bg-[#0767E2] p-6 pb-20 rounded-3xl shadow-[0px_4px_4px_rgba(0,0,0,0.3)]">
            <p className="text-white font-bold">Have a good day</p>
            <p className="text-white text-2xl ">
              {localStorage.getItem("user") &&
                JSON.parse(localStorage.getItem("user")!).name}
            </p>
            {patient && (
              <div className="">
                <div className="w-full h-fit bg-white text-base p-2 rounded-lg">
                  <p className="font-bold">Patient selected</p>
                  <p>{patient?.name}</p>
                </div>
                {result.diastolic === 0 && (
                  <button
                    className="text-white text-lg hover:underline"
                    onClick={openForm}
                  >
                    Change patient
                  </button>
                )}
              </div>
            )}
          </div>
          <img src={bpmPro2Img} alt="" className="w-90 h-90 mx-auto" />
          <div className="flex gap-4 font-bold tracking-wider justify-around">
            {result.diastolic === 0 ? (
              !buttonLoading ? (
                <button
                  disabled={buttonLoading}
                  onClick={patient ? () => buttonStart(patient) : openForm}
                  className="px-8 py-4 bg-white text-blue-700 border-blue-700 border-2 rounded-full w-xs shadow-xl disabled:bg-slate-200 hover:bg-slate-200"
                >
                  START
                </button>
              ) : (
                <div className="mx-auto">
                  <p className="w-fit mx-auto text-sm font-normal mb-10">
                    Measuring ...
                  </p>
                  <button
                    onClick={() => buttonStop()}
                    className="px-8 py-4 bg-white text-red-700 border-red-700 border-2 rounded-full w-xs shadow-xl disabled:bg-slate-200 hover:bg-slate-200"
                  >
                    STOP
                  </button>
                </div>
              )
            ) : (
              <div className="">
                {!isSaved && (
                  <button
                    onClick={handleSaveResult}
                    className="px-8 py-4 bg-white text-blue-700 border-blue-700 border-2 rounded-full w-xs shadow-xl disabled:opacity-50 hover:bg-slate-100"
                  >
                    SAVE
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSaved(false);
                    clearResult();
                  }}
                  className="px-8 py-4 bg-white text-red-700 border-red-700 border-2 rounded-full w-xs shadow-xl disabled:opacity-50 hover:bg-slate-100"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          className={`flex flex-col gap-6 lg:w-1/2 bg-slate-100 p-6 rounded-3xl transform transition-all duration-700 ease-out delay-200 ${
            animatePage
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col bg-white rounded-3xl p-6 gap-2 shadow-xl">
            <div className="flex justify-between h-14">
              <p className="text-2xl">Measurement Result</p>
              <div
                className={`px-8 py-2 rounded-full h-fit transition-opacity ${
                  categoryResult?.name
                    ? "opacity-100 bg-[#FFE500]"
                    : "opacitiy-0 invisible"
                }`}
              >
                <p className="text-2xl">{categoryResult?.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          <div className="bg-white rounded-3xl p-2 shadow-xl ">
            <div className="w-fit mx-auto">
              <div
                className={`transition-all duration-700 delay-300 ${
                  animatePage ? "opacity-100" : "opacity-0"
                }`}
              >
                <ChartHeartRate items={items} />
              </div>
            </div>
          </div>

          {/* <PressButtonModal start={start} message={message} /> */}
        </div>
        <CreateNewPatient
          form={form}
          closeModal={closeForm}
          setPatient={setPatient}
          openFormSelectPatient={openFormSelectPatient}
          buttonLoading={buttonLoading}
          start={start}
        />
        <SelectPatient
          formSelectPatient={formSelectPatient}
          openForm={openForm}
          closeModal={closeFormSelectPatient}
          token={token}
          patientSelected={setPatient}
        />
      </div>
    </MainLayout>
  );
}
