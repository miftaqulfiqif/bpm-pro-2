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
  const [patient, setPatients] = useState<PatientProps[]>();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const isFirstRender = useRef(true);

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
      setCurrentPage(response.data.current_page);
      setTotalItems(response.data.total_items);
      setTotalPage(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const searchPatients = debounce(async (searchQuery: string) => {
    // if (!searchQuery) return;
    try {
      const response = await axios.get(
        "http://localhost:3000/api/patients-pagination",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: 1,
            limit: limit,
            query: search,
          },
        }
      );

      setPatients(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalItems(response.data.total_items);
      setTotalPage(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, 500);

  useEffect(() => {
    if (search) {
      searchPatients(search);
    } else {
      fetchPatients();
    }
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
            <div className="flex bg-white items-center gap-2 px-4 py-2 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]">
              <img src={exportIcon} alt="" className="w-6 h-6" />
              <p>Export</p>
            </div>
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
              {patient?.map((item) => (
                <TableRow key={item.id} className=" border-gray-300">
                  <TableCell className="text-left pl-10">{item.name}</TableCell>
                  <TableCell className="text-left pl-10">{item.work}</TableCell>
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
              ))}
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
      <CreateNewPatient
        form={form}
        closeModal={closeForm}
        setPatient={setPatients}
        fetchPatients={fetchPatients}
      />
    </MainLayout>
  );
};
