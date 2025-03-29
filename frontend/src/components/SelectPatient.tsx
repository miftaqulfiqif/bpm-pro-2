import createPatientIcon from "@/assets/icons/add-patient.png";

type SelectPatientProps = {
  formSelectPatient: boolean;
  closeModal: () => void;
  openForm: () => void;
};

export const SelectPatient = ({
  formSelectPatient,
  closeModal,
  openForm,
}: SelectPatientProps) => {
  return (
    <div
      onClick={closeModal} // Klik di luar modal akan menutup modal
      className={`fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 z-40 flex justify-center items-center ${
        formSelectPatient ? "" : "hidden"
      }`}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()} // Cegah event klik menyebar ke parent
        className="bg-white rounded-xl p-10 z-50 w-4xl h-[600px] shadow-lg"
      >
        <div className="flex flex-row justify-between mb-8">
          <p className="text-2xl">Select patient</p>
          <button
            onClick={openForm}
            className="flex items-center gap-2 shadow-[0px_4px_4px_rgba(0,0,0,0.3)] bg-[#A4FFB1] px-4 py-2 rounded-3xl"
          >
            <img src={createPatientIcon} alt="Add" className="w-6 h-6" />
            <p>Create new patient</p>
          </button>
        </div>
        <div className="flex flex-col gap-8">
          <div className="w-full">
            <label htmlFor="patient-name" className="w-full">
              <p className="text-lg ml-1">Patient name</p>
              <input
                type="text"
                name="patient-name"
                placeholder="Input patient name here"
                className="bg-[#ECECEC] text-sm px-4 py-2 rounded-sm w-full disabled:bg-slate-200"
              />
            </label>
          </div>
          <div className="relative flex flex-col bg-[#ECECEC] rounded-2xl w-full max-h-full p-4">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0px_4px_4px_rgba(0,0,0,0.3)]"></div>
            <table className="w-full font-normal relative z-10">
              <thead>
                <tr>
                  <th className="py-4">Patient name</th>
                  <th className="py-4">Patient Place of birth</th>
                  <th className="py-4">Patient Date of birth</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">Miftaqul Fiqi Firmansyah</td>
                  <td className="p-2">Surabaya</td>
                  <td className="p-2">21 September 2001</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
