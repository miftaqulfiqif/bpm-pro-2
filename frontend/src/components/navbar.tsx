import { useState, useEffect } from "react";
import { AppNavbar } from "./ui/app-navbar";

import arrowDownIcon from "@/assets/icons/arrow-down-sign-to-navigate 2.svg";
import patientsIcon from "@/assets/icons/patients-icon.png";
import patientsIconActive from "@/assets/icons/patients-icon-white.png";
import patientMeasurementIcon from "@/assets/icons/patient-measurements.png";
import patientMeasurementIconActive from "@/assets/icons/patient-measurement-white.png";

import { LayoutDashboardIcon, HeartPulse } from "lucide-react";

interface NavbarProps {
  className?: string;
  title: string;
}

export const Navbar = ({ className, title }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleOption = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    setState(title);
  }, [title]);

  return (
    <nav className={`bg-[#ECECEC] h-30 flex items-center px-20 ${className}`}>
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex gap-6 ml-20">
          <AppNavbar
            title="Dashboard"
            url="/dashboard"
            icon={LayoutDashboardIcon}
            isActive={state === "Dashboard"}
          />
          <AppNavbar
            title="Patient"
            url="/patient"
            icon={patientsIcon}
            iconActive={patientsIconActive}
            isActive={state === "Patient"}
          />
          <AppNavbar
            title="Patient Measurement"
            url="/patient-measurement"
            icon={patientMeasurementIcon}
            iconActive={patientMeasurementIconActive}
            isActive={state === "Patient Measurement"}
          />
        </div>

        <div className="flex flex-row items-center gap-20">
          <div className="">
            <a
              className="flex gap-2 items-center bg-[#736DF6] px-10 py-5 w-fit rounded-4xl shadow-[4px_4px_15px_rgba(0,0,0,0.3)] text-white hover:underline"
              href="/measurement"
            >
              <HeartPulse className="w-8 h-8" />
              Measurement
            </a>
          </div>
          <div className="flex flex-row gap-4 bg-white px-6 py-3 w-fit rounded-2xl shadow-[4px_4px_15px_rgba(0,0,0,0.3)] items-center">
            <div className="bg-[#736DF6] w-16 h-16 rounded-full"></div>
            <div className="mr-4">
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Miftaqul Fiqi Firmansyah</p>
                <p className="text-sm text-gray-500">
                  miftaqulfiqiSinko@elitech.com
                </p>
              </div>
            </div>
            <button onClick={handleOption}>
              <img src={arrowDownIcon} alt="" />
            </button>
          </div>
          {isOpen && (
            <div className=" absolute bg-white right-20 top-28 px-4 py-4 rounded-2xl">
              <div className="flex flex-col gap-2 text-center ">
                <a href="/settings" className="hover:underline">
                  <p>Settings</p>
                </a>
                <a
                  href="#"
                  className="bg-red-500 px-6 py-2 rounded-xl text-white hover:underline"
                >
                  Log out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
