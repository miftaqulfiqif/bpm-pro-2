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

type Patient = {
  name: string;
  gender: string;
  phone: string;
  work: string;
  last_education: string;
  place_of_birth: string;
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const isFirstRender = useRef(true);

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
            query: search,
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

  useEffect(() => {
    if (search) {
      searchPatientMeasurements(search);
    } else {
      fetchPatientMeasurements();
    }
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
            <div className="flex bg-white items-center gap-2 px-4 py-2 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]">
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
                <TableHead className="text-center">Category Result</TableHead>
                <TableHead className="text-center pl-10">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientMeasurements?.map((item) => (
                <TableRow key={item.id} className=" border-gray-300">
                  <TableCell className="text-left pl-10">
                    {item.patient.name}
                  </TableCell>
                  <TableCell className="text-center pl-10">
                    {item.patient.phone}
                  </TableCell>
                  <TableCell className="text-center">{item.systolic}</TableCell>
                  <TableCell className="text-center">
                    {item.diastolic}
                  </TableCell>
                  <TableCell className="text-center">{item.mean}</TableCell>
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
              ))}
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
    </MainLayout>
  );
};
