import { useState, useEffect } from "react";
import { AppNavbar } from "./ui/app-navbar";

import arrowDownIcon from "@/assets/icons/arrow-down-sign-to-navigate 2.svg";
import patientsIcon from "@/assets/icons/patients-icon.png";
import patientsIconActive from "@/assets/icons/patients-icon-white.png";
import patientMeasurementIcon from "@/assets/icons/patient-measurements.png";
import patientMeasurementIconActive from "@/assets/icons/patient-measurement-white.png";

import { LayoutDashboardIcon, HeartPulse } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  className?: string;
  title: string;
}

export const Navbar = ({ className, title }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleOption = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    setState(title);
  }, [title]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsMounted(false), 300);
    }
  }, [isOpen]);

  return (
    <nav className={`bg-[#ECECEC] h-30 flex items-center px-10 ${className}`}>
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex gap-4 ml-20">
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

        <div className="flex flex-row items-center gap-10">
          <div className="">
            <a
              className="flex gap-2 items-center bg-[#0767E2] px-10 py-3 w-fit rounded-4xl shadow-[4px_4px_15px_rgba(0,0,0,0.3)] text-white hover:underline"
              href="/measurement"
            >
              <HeartPulse className="w-8 h-8" />
              Measurement
            </a>
          </div>
          <div
            onClick={handleOption}
            className="flex flex-row gap-4 bg-white px-6 py-3 w-fit rounded-4xl shadow-[4px_4px_15px_rgba(0,0,0,0.3)] items-center"
          >
            <img
              src="https://i.pravatar.cc/150?img=1"
              className="w-14 h-14 rounded-full shadow-[4px_4px_15px_rgba(0,0,0,0.2)]"
              alt=""
            />{" "}
            <div className="mr-4">
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.username}</p>
              </div>
            </div>
            <button>
              <img src={arrowDownIcon} alt="" className="w-4 h-4" />
            </button>
          </div>
          {isMounted && (
            <div
              className={`absolute bg-white right-20 top-28 px-4 py-4 rounded-2xl transition-all duration-300 ease-out transform z-50 ${
                isVisible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-2 scale-95 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-2 text-center">
                <a href="/settings" className="hover:underline">
                  <p>Settings</p>
                </a>
                <a
                  onClick={logout}
                  className="bg-red-500 px-6 py-2 rounded-xl text-white hover:underline cursor-pointer"
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
