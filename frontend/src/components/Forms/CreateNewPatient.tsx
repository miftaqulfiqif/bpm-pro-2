import { useCreateNewPatient } from "@/hooks/UserCreateNewPatient";
import { InputDate } from "./FormsInput/InputDate";
import { InputText } from "./FormsInput/InputText";
import { InputSelect } from "./FormsInput/InputSelect";

import closeIcon from "@/assets/icons/close.png";
import { useCounter } from "@/hooks/Counter";

type CreateNewPatientProps = {
  form: boolean;
  closeModal: () => void;
};

export const CreateNewPatient = (props: CreateNewPatientProps) => {
  const { buttonLoading } = useCounter();
  const { form, closeModal } = props;
  const formik = useCreateNewPatient();

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 z-40 ${
        form ? "" : "hidden"
      }`}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-10 z-50 max-w-[900px]">
        <div className="flex flex-row justify-between mb-8">
          <p className="text-2xl">Create new patient</p>
          <button type="button" onClick={closeModal}>
            <img src={closeIcon} alt="" srcSet="" className="w-5 " />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-row gap-4 justify-between w-full">
              <InputText
                name="name"
                label="Name"
                placeholder="Input name"
                onChange={formik.handleChange}
                value={formik.values.name}
                onTouch={formik.touched.name}
                onError={formik.errors.name}
              />
              <InputSelect
                label="Gender"
                name="gender"
                placeholder="Select gender"
                option={["Male", "Female"]}
                onChange={formik.handleChange}
                value={formik.values.gender}
                onTouch={formik.touched.gender}
                onError={formik.errors.gender}
              />
            </div>
            <div className="flex flex-row gap-4 justify-between w-full">
              <InputText
                name="phone"
                type="tel"
                label="Phone"
                placeholder="Input phone"
                onChange={formik.handleChange}
                value={formik.values.phone}
                onTouch={formik.touched.phone}
                onError={formik.errors.phone}
              />
              <InputText
                name="last_education"
                label="Last education"
                placeholder="Input last education"
                onChange={formik.handleChange}
                value={formik.values.last_education}
                onTouch={formik.touched.last_education}
                onError={formik.errors.last_education}
              />
            </div>
            <div className="flex flex-row gap-4 justify-between w-full">
              <InputText
                name="place_of_birth"
                label="Place of birth"
                placeholder="Input place of birth"
                onChange={formik.handleChange}
                value={formik.values.place_of_birth}
                onTouch={formik.touched.place_of_birth}
                onError={formik.errors.place_of_birth}
              />
              <InputDate
                name="date_of_birth"
                label="Date of birth"
                onChange={formik.handleChange}
                value={formik.values.date_of_birth}
                onTouch={formik.touched.date_of_birth}
                onError={formik.errors.date_of_birth}
              />
            </div>
            <div className="flex flex-row gap-4 justify-between w-full">
              <InputText
                name="address"
                label="Address"
                placeholder="Input address"
                onChange={formik.handleChange}
                value={formik.values.address}
                onTouch={formik.touched.address}
                onError={formik.errors.address}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={buttonLoading}
              className="px-4 py-2 bg-blue-white border-blue-700 text-blue-700 border-2 rounded-full w-xs shadow-xl mt-8 disabled:bg-slate-300 "
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
