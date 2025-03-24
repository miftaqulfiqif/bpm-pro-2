import { useCounter } from "../../hooks/Counter";
import { InputText } from "./InputText";

export const CreateNewPatient = () => {
  const { buttonStart, buttonStop, buttonLoading } = useCounter();
  return (
    <div className="flex flex-col bg-slate-100 rounded-2xl w-full h-fit p-6 gap-4">
      <p className="text-2xl">Create new patient</p>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-4 justify-between w-full">
          <InputText label="Name" placeholder="Input name" />
          <label htmlFor="" className="w-full">
            <p className="text-lg ml-1">Gender</p>
            <select className="bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] text-xl px-4 py-2 rounded-sm w-full">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
        </div>
        <div className="flex flex-row gap-4 justify-between w-full">
          <InputText label="Phone" placeholder="Input phone" />
          <InputText
            label="Last education"
            placeholder="Input last education"
          />
        </div>
        <div className="flex flex-row gap-4 justify-between w-full">
          <InputText
            label="Place of birth"
            placeholder="Input place of birth"
          />
          <InputText label="Date of birth" placeholder="Input date of birth" />
        </div>
        <div className="flex flex-row gap-4 justify-between w-full">
          <InputText label="Address" placeholder="Input address" />
        </div>
      </div>
      <div className="flex gap-4 text-white text-lg font-bold tracking-wider justify-around w-sm h-fit mt-10 mx-auto">
        <button
          disabled={buttonLoading}
          onClick={buttonStart}
          className="px-4 py-2 bg-blue-700  rounded-full w-xs shadow-xl disabled:opacity-50"
        >
          START
        </button>
        <button
          onClick={buttonStop}
          className="px-4 py-2 bg-red-500  rounded-full w-xs shadow-xl"
        >
          STOP
        </button>
      </div>
    </div>
  );
};
