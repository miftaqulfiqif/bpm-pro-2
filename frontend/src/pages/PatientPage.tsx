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
import { CreateNewPatient } from "@/components/Forms/CreateNewPatient";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Component } from "@/components/ui/ChartArea";

type PatientProps = {
  id: number;
  name: string;
  gender: string;
  phone: string;
  work: string;
  last_education: string;
  place_of_birth: string;
  date_of_birth: string;
};

export const PatientPage = () => {
  const [form, setForm] = useState(false);
  const [detail, setDetail] = useState(false);

  const [patients, setPatients] = useState<PatientProps[]>();
  const [patientId, setPatientId] = useState(0);
  const [patient, setPatient] = useState<PatientProps[]>();
  const selectedPatient = patients?.find((item) => item.id === patientId);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
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

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/patients-pagination",
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

      setPatients(response.data.data);
      setPatient(response.data.data.slice(1));
      setCurrentPage(response.data.current_page);
      setTotalItems(response.data.total_items);
      setTotalPage(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const searchPatients = debounce(async (searchQuery: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/patients-pagination",
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

      if (response.data.total_pages < currentPage) {
        setCurrentPage(response.data.total_pages);
      }

      setPatients(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalItems(response.data.total_items);
      setTotalPage(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, 500);

  const exportXML = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/export-patients",
        { patients },
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
      link.setAttribute("download", "patients.xml");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    if (form) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300);
    }
  }, [form]);

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
      searchPatients(search);
    } else {
      fetchPatients();
    }

    setDetail(false);

    setAnimateRows(false);
    setTimeout(() => {
      setAnimateRows(true);
    }, 50);

    return () => searchPatients.cancel();
  }, [currentPage, limit, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPage) {
      setCurrentPage(page);
    }
  };
  const goToNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openForm = () => {
    setForm(true);
  };
  const closeForm = () => {
    setForm(false);
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

    setPatient(patients?.filter((patient) => patient.id === id));
  };

  const buttonAction = (id: number) => {
    alert("Button Clicked " + id);
  };
  return (
    <MainLayout title="Patient">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between mx-8">
          <div className="">
            <p className="text-3xl font-bold">Patients</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <p>Showing</p>
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                {" "}
                <SelectTrigger className="w-fit bg-[rgba(117,195,255,0.5)] border-0">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
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
            <a
              href="#"
              className="flex bg-white items-center gap-2 px-4 py-2 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]"
              onClick={exportXML}
            >
              <img src={exportIcon} alt="" className="w-6 h-6" />
              <p>Export</p>
            </a>
            <a
              href="#"
              onClick={openForm}
              className="flex bg-[#3885FD] items-center gap-2 px-4 py-2 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)] "
            >
              <img src={addPatientIcon} alt="" className="w-6 h-6" />
              <p className="text-white">Add Patient</p>
            </a>
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
                    <TableHead className="text-center pl-10">Work</TableHead>
                    <TableHead className="text-center pl-10">Phone</TableHead>
                    <TableHead className="text-center pl-10">Address</TableHead>
                    <TableHead className="text-center pl-10">Gender</TableHead>
                    <TableHead className="text-center pl-10">
                      Date of Birth
                    </TableHead>
                    <TableHead className="text-center pl-10">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients && patients.length > 0 ? (
                    patients?.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={`border-gray-300 transition-all duration-500 ease-in-out ${
                          animateRows
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        }`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                        onClick={() => {
                          openDetail(item.id);
                        }}
                      >
                        <TableCell className="text-left pl-10">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-left pl-10">
                          {item.work}
                        </TableCell>
                        <TableCell className="text-left pl-10">
                          {item.phone}
                        </TableCell>
                        <TableCell className="text-left pl-10">
                          {item.place_of_birth}
                        </TableCell>
                        <TableCell className="text-left pl-10">
                          {item.gender}
                        </TableCell>
                        <TableCell className="text-left pl-10">
                          {new Intl.DateTimeFormat("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(item.date_of_birth))}
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
                      <TableCell colSpan={7} className="text-center">
                        No data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7} className="p-4 text-center">
                      <Pagination>
                        <PaginationContent className="flex w-full justify-between">
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={goToPreviousPage}
                              isActive={currentPage === 1}
                              href="#"
                            />
                          </PaginationItem>
                          <PaginationItem className="flex flex-row gap-2">
                            {[...Array(totalPage)].map((_, index) => (
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
                              onClick={goToNextPage}
                              isActive={currentPage === totalPage}
                              href="#"
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
                  <p className="font-semibold">{selectedPatient?.name}</p>
                  <p>Gender</p>
                  <p className="font-semibold">{selectedPatient?.gender}</p>
                  <p>Phone</p>
                  <p className="font-semibold">{selectedPatient?.phone}</p>
                  <p>Work</p>
                  <p className="font-semibold">{selectedPatient?.work}</p>
                  <p>Last Education</p>
                  <p className="font-semibold">
                    {selectedPatient?.last_education}
                  </p>
                  <p>Place of Birth</p>
                  <p className="font-semibold">
                    {selectedPatient?.place_of_birth}
                  </p>
                  <p>Date of Birth</p>
                  <p className="font-semibold">
                    {selectedPatient
                      ? new Intl.DateTimeFormat("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(selectedPatient?.date_of_birth))
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateNewPatient
        form={form}
        closeModal={closeForm}
        setPatient={setPatients}
        fetchPatients={fetchPatients}
      />
    </MainLayout>
  );
};
