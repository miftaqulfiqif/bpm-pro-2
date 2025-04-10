import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import exportIcon from "@/assets/icons/export-svgrepo-com.png";
import addPatientIcon from "@/assets/icons/add-patient-white.png";
import searchIcon from "@/assets/icons/search-icon.png";

import MainLayout from "@/components/layouts/main-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Component } from "@/components/ui/ChartArea";

type Patient = {
  name: string;
  gender: string;
  phone: string;
  work: string;
  last_education: string;
  place_of_birth: string;
  date_of_birth: string;
};
type PatientMeasurementsProps = {
  id: number;
  patient_id: number;
  patient: Patient;
  user_id: string;
  weight: number;
  systolic: number;
  diastolic: number;
  mean: number;
  heart_rate: number;
  category_result: string;
};

export const PatientMeasurements = () => {
  const [patientMeasurements, setPatientMeasurements] = useState<
    PatientMeasurementsProps[]
  >([]);

  const [detail, setDetail] = useState(false);
  const [patientMeasurement, setPatientMeasurement] =
    useState<PatientMeasurementsProps[]>();
  const [patientId, setPatientId] = useState(0);
  const selectedPatient = patientMeasurements?.find(
    (item) => item.id === patientId
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const isFirstRender = useRef(true);

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const chartData = Array.from({ length: 6 }, (_, i) => ({
    month: ["January", "February", "March", "April", "May", "June"][i],
    systolic: Math.floor(Math.random() * 200) + 80,
    diastolic: Math.floor(Math.random() * 120) + 60,
  }));

  const fetchPatientMeasurements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/patient-measurements-pagination-by-user",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: currentPage,
            limit: limit,
          },
        }
      );

      setPatientMeasurements(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalItems(response.data.total_items);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching patient measurements:", error);
    }
  };

  const searchPatientMeasurements = debounce(async (searchQuery: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/patient-measurements-pagination-by-user",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: currentPage,
            limit: limit,
            query: searchQuery,
          },
        }
      );

      setPatientMeasurements(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalItems(response.data.total_items);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching patient measurements:", error);
    }
  }, 500);

  const exportXML = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/export-patient-measurements",
        {
          patientMeasurements,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "patient_measurements.xml");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export XML error : ", error);
    }
  };

  useEffect(() => {
    if (detail) {
      setTimeout(() => setIsDetailVisible(true), 10);
    } else {
      setIsDetailVisible(false);
      setTimeout(() => setDetail(false), 300);
    }
  }, [detail]);

  useEffect(() => {
    if (search) {
      searchPatientMeasurements(search);
    } else {
      fetchPatientMeasurements();
    }
    setDetail(false);

    setAnimateRows(false);
    setTimeout(() => {
      setAnimateRows(true);
    }, 50);
    return () => searchPatientMeasurements.cancel();
  }, [currentPage, limit, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openDetail = (id: number) => {
    if (detail && patientId === id) {
      setIsDetailVisible(false);
      setTimeout(() => {
        setDetail(false);
      }, 300);
    } else {
      setPatientId(id);
      setDetail(true);
      setTimeout(() => {
        setIsDetailVisible(true);
      }, 10);
    }
    setPatientMeasurement(
      patientMeasurements?.filter((patient) => patient.id === id)
    );
  };

  const buttonAction = (id: number) => {
    alert("Button Clicked " + id);
  };
  return (
    <MainLayout title="Patient Measurement">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between mx-8">
          <div className="">
            <p className="text-3xl font-bold">Patient Measurement</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <p>Showing</p>
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-fit bg-[rgba(117,195,255,0.5)] border-0">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="border-0 w-fit">
                  <SelectItem value="10" className="hover:bg-[#ECECEC]">
                    10
                  </SelectItem>
                  <SelectItem value="20" className="hover:bg-[#ECECEC]">
                    20
                  </SelectItem>
                  <SelectItem value="30" className="hover:bg-[#ECECEC]">
                    30
                  </SelectItem>
                  <SelectItem value="50" className="hover:bg-[#ECECEC]">
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className="flex bg-white items-center gap-2 px-4 py-2 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]"
              onClick={exportXML}
            >
              <img src={exportIcon} alt="" className="w-6 h-6" />
              <p>Export</p>
            </div>

            <div className=" bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]">
              <label
                htmlFor="search"
                className="flex items-center gap-2 px-4 py-2"
              >
                <img src={searchIcon} alt="" className="w-6 h-6" />
                <input
                  type="text"
                  id="search"
                  placeholder="Search"
                  className="px-2 focus:outline-none"
                  value={search}
                  onChange={handleSearchChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="w-full">
            {/* Table */}
            <div className="w-full bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.3)]">
              <Table>
                <TableHeader>
                  <TableRow className="h-16">
                    <TableHead className="text-center pl-10">Name</TableHead>
                    <TableHead className="text-center pl-10">Phone</TableHead>
                    <TableHead className="text-center">Systolic</TableHead>
                    <TableHead className="text-center">Diastolic</TableHead>
                    <TableHead className="text-center">Mean</TableHead>
                    <TableHead className="text-center">Heart Rate</TableHead>
                    <TableHead className="text-center">
                      Category Result
                    </TableHead>
                    <TableHead className="text-center pl-10">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientMeasurements && patientMeasurements.length > 0 ? (
                    patientMeasurements?.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={`border-gray-300 transition-all duration-500 ease-in-out ${
                          animateRows
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        }`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                        onClick={() => openDetail(item.id)}
                      >
                        <TableCell className="text-left pl-10">
                          {item.patient.name}
                        </TableCell>
                        <TableCell className="text-center pl-10">
                          {item.patient.phone}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.systolic}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.diastolic}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.mean}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.heart_rate}
                        </TableCell>
                        <TableCell className="pl-10 px-10 text-center">
                          {item.category_result === "Unknown" ? (
                            <div className="bg-gray-300 rounded-full py-2">
                              {item.category_result}
                            </div>
                          ) : (
                            <div className="bg-[#1EFE0A] rounded-full py-2">
                              {item.category_result}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center pl-10 text-xl">
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              buttonAction(item.id);
                            }}
                          >
                            <p>...</p>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={8} className="p-4 text-center">
                      <Pagination>
                        <PaginationContent className="flex w-full justify-between">
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={goToPreviousPage}
                              isActive={currentPage === 1}
                            />
                          </PaginationItem>
                          <PaginationItem className="flex flex-row gap-2">
                            {[...Array(totalPages)].map((_, index) => (
                              <PaginationLink
                                key={index}
                                href="#"
                                isActive={currentPage === index + 1}
                                onClick={() => goToPage(index + 1)}
                              >
                                {index + 1}
                              </PaginationLink>
                            ))}
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={goToNextPage}
                              isActive={currentPage === totalPages}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
          {detail && (
            <div
              className={`flex w-1/3 h-fit transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isDetailVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div className="w-full h-full p-5 bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.3)] flex flex-col gap-4">
                <p>Detail Patient</p>
                <Component chartData={chartData} />
                <div>
                  <p>Name</p>
                  <p className="font-semibold">
                    {selectedPatient?.patient.name}
                  </p>
                  <p>Gender</p>
                  <p className="font-semibold">
                    {selectedPatient?.patient.gender}
                  </p>
                  <p>Phone</p>
                  <p className="font-semibold">
                    {selectedPatient?.patient.phone}
                  </p>
                  <p>Work</p>
                  <p className="font-semibold">
                    {selectedPatient?.patient.work}
                  </p>
                  <p>Last Education</p>
                  <p className="font-semibold">
                    {selectedPatient?.patient.last_education}
                  </p>
                  <p>Place of Birth</p>
                  <p className="font-semibold">
                    {selectedPatient?.patient.place_of_birth}
                  </p>
                  <p>Date of Birth</p>
                  <p className="font-semibold">
                    {selectedPatient
                      ? new Intl.DateTimeFormat("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(
                          new Date(selectedPatient?.patient.date_of_birth)
                        )
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
