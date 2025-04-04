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
import { useState } from "react";

type PatientProps = {
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
  const [patient, setPatient] = useState<PatientProps>();

  const openForm = () => {
    setForm(true);
  };
  const closeForm = () => {
    setForm(false);
  };
  const buttonAction = () => {
    alert("Button Clicked");
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
              <Select>
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
                  <SelectItem value="40" className="hover:bg-[#ECECEC]">
                    40
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
            <div
              onClick={openForm}
              className="flex bg-[#3885FD] items-center gap-2 px-4 py-2 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)] "
            >
              <img src={addPatientIcon} alt="" className="w-6 h-6" />
              <p className="text-white">Add Patient</p>
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
                  className="px-2"
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
                <TableHead className="text-center pl-10">Email</TableHead>
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
              <TableRow className="border-0 ">
                <TableCell className="text-left pl-10">
                  Miftaqul Fiqi Firmansyah
                </TableCell>
                <TableCell className="text-left pl-10">
                  miftaqul2001as@mgaps.com
                </TableCell>
                <TableCell className="text-left pl-10">Phone</TableCell>
                <TableCell className="text-left pl-10">Address</TableCell>
                <TableCell className="text-left pl-10">Gender</TableCell>
                <TableCell className="text-left pl-10">Date of Birth</TableCell>
                <TableCell className="text-center pl-10 text-xl">
                  <a href="" onClick={buttonAction}>
                    <p>...</p>
                  </a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-left pl-10">
                  Miftaqul Fiqi Firmansyah
                </TableCell>
                <TableCell className="text-left pl-10">
                  miftaqul2001as@mgaps.com
                </TableCell>
                <TableCell className="text-left pl-10">Phone</TableCell>
                <TableCell className="text-left pl-10">Address</TableCell>
                <TableCell className="text-left pl-10">Gender</TableCell>
                <TableCell className="text-left pl-10">Date of Birth</TableCell>
                <TableCell className="text-center pl-10 text-xl">
                  <a href="" onClick={buttonAction}>
                    <p>...</p>
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="p-4 text-center">
                  <Pagination>
                    <PaginationContent className="flex w-full justify-between">
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem className="flex flex-row gap-2">
                        <PaginationLink href="#">1</PaginationLink>
                        <PaginationLink href="#">2</PaginationLink>
                        <PaginationLink isActive href="#">
                          3
                        </PaginationLink>
                        <PaginationEllipsis />
                        <PaginationLink href="#">5</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
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
        setPatient={setPatient}
        buttonStart={buttonAction}
      />
    </MainLayout>
  );
};
