import createPatientIcon from "@/assets/icons/add-patient.png";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import _ from "lodash";

type SelectPatientProps = {
  formSelectPatient: boolean;
  closeModal: () => void;
  openForm: () => void;
  token: string | null;
  patientSelected: (patient: any) => void;
};

export const SelectPatient = ({
  formSelectPatient,
  closeModal,
  openForm,
  token,
  patientSelected,
}: SelectPatientProps) => {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([
    {
      id: "",
      name: "",
      gender: "",
      phone: "",
      work: "",
      last_education: "",
      place_of_birth: "",
      date_of_birth: "",
    },
  ]);

  const fetchPatients = async (query: string) => {
    if (!query.trim()) {
      setPatients([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/api/patients/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPatients(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    }
  };

  // Gunakan debounce untuk menghindari request berlebihan
  const debouncedFetchPatients = useCallback(
    _.debounce(fetchPatients, 500),
    []
  );

  useEffect(() => {
    debouncedFetchPatients(search);
  }, [search, debouncedFetchPatients]);

  const handlePatientSelect = (patient: any) => {
    patientSelected(patient);
    closeModal();
  };

  return (
    <div
      onClick={closeModal}
      className={`fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 z-40 transition-opacity duration-300 ${
        formSelectPatient ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backdropFilter: "blur(5px)", background: "rgba(0, 0, 0, 0.2)" }}
    >
      <div
        className={`fixed top-1/2 left-1/2 transform bg-white rounded-xl p-8 z-50 w-4xl h-[600px] transition-all duration-300 ease-in-out
          ${
            formSelectPatient
              ? "opacity-100 scale-100 translate-x-[-50%] translate-y-[-50%]"
              : "opacity-0 scale-95 translate-x-[-50%] translate-y-[-40%]"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <p className="text-2xl font-semibold">Select Patient</p>
          <button
            onClick={openForm}
            className="flex flex-row gap-2 items-center shadow-[0px_4px_4px_rgba(0,0,0,0.3)] bg-[#14f536] hover:bg-[#A4FFB1] px-4 py-2 rounded-3xl"
          >
            <img src={createPatientIcon} alt="Add" className="w-6 h-6" />
            <p>Create new patient</p>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="patient-name" className="text-lg">
            Patient Name
          </label>
          <div className="flex gap-2">
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              id="patient-name"
              type="text"
              placeholder="Input patient name here"
              className="bg-gray-100 text-sm px-4 py-2 rounded-lg w-full"
            />
            <button
              type="submit"
              onClick={() => fetchPatients(search)}
              disabled={!search.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Search
            </button>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl mt-4 p-4 shadow-[inset_0_4px_4px_rgba(0,0,0,0.1)] overflow-y-auto h-64">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Place of Birth</th>
                <th className="py-2">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {search.trim() === "" ? (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    Please input patient name
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={handlePatientSelect.bind(null, patient)}
                  >
                    <td className="p-2">{patient.name}</td>
                    <td className="p-2">{patient.place_of_birth}</td>
                    <td className="p-2">
                      {new Intl.DateTimeFormat("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(patient.date_of_birth))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
