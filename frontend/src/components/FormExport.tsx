import { Patients } from "@/models/Patients";
import axios from "axios";
import React, { useState } from "react";

type FormExportProps = {
  patients: Patients[];
};

const FormExport: React.FC<FormExportProps> = ({ patients }) => {
  const [exportType, setExportType] = useState<"pdf" | "xml">("pdf");
  const [dataType, setDataType] = useState<"all" | "filtered">("all");
  const [password, setPassword] = useState("");

  const exportXML = async (patientsToExport: Patients[]) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/export-patients",
        { patients: patientsToExport },
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
      console.error("Error exporting XML:", error);
      alert("Gagal export XML");
    }
  };

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredPatients =
      dataType === "all"
        ? patients
        : patients.filter((p) => p.gender === "male");

    if (exportType === "xml") {
      await exportXML(filteredPatients);
    } else {
      alert("Export to PDF belum diimplementasi 🚧");
    }
  };

  return (
    <form
      onSubmit={handleExport}
      className="flex flex-col bg-white w-fit mt-20 p-4 rounded-2xl gap-4"
    >
      <p className="font-semibold">Export to</p>
      <div className="flex flex-row gap-2">
        {["pdf", "xml"].map((type) => (
          <label key={type} className="cursor-pointer w-20 text-center">
            <input
              type="radio"
              name="exportType"
              value={type}
              checked={exportType === type}
              onChange={() => setExportType(type as "pdf" | "xml")}
              className="hidden peer"
            />
            <div className="peer-checked:bg-blue-300 bg-gray-200 px-4 py-2 rounded-lg capitalize">
              {type.toUpperCase()}
            </div>
          </label>
        ))}
      </div>

      <p className="font-semibold">Data export</p>
      <div className="flex flex-row gap-2">
        {["all", "filtered"].map((type) => (
          <label key={type} className="cursor-pointer w-20 text-center">
            <input
              type="radio"
              name="dataExport"
              value={type}
              checked={dataType === type}
              onChange={() => setDataType(type as "all" | "filtered")}
              className="hidden peer"
            />
            <div className="peer-checked:bg-blue-300 bg-gray-200 px-4 py-2 rounded-lg capitalize">
              {type}
            </div>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-300 py-2 px-6 rounded-lg mt-4 hover:bg-blue-400"
      >
        Export
      </button>
    </form>
  );
};

export default FormExport;
