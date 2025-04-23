import { InputDate } from "./FormsInput/InputDate";
import { InputText } from "./FormsInput/InputText";
import { InputSelect } from "./FormsInput/InputSelect";

import closeIcon from "@/assets/icons/close.png";
import patients from "@/assets/icons/patients-icon.png";

import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Patients } from "@/models/Patients";
import { toast } from "sonner";

type CreateNewPatientProps = {
  form: boolean;
  setPatient: (e: any) => void;
  closeModal: () => void;
  fetchPatients?: () => void;
  openFormSelectPatient?: () => void;
  buttonLoading?: boolean;
  start?: boolean;
  patient?: Patients;
};

export const CreateNewPatient = (props: CreateNewPatientProps) => {
  const {
    form,
    setPatient,
    closeModal,
    fetchPatients,
    openFormSelectPatient,
    buttonLoading,
    start,
    patient,
  } = props;

  const updatePatient = async (patient: Patients) => {
    try {
      await axios
        .patch(
          `http://localhost:3000/api/patient/${patient.id}`,
          {
            name: patient.name,
            gender: patient.gender,
            phone: patient.phone,
            last_education: patient.last_education,
            place_of_birth: patient.place_of_birth,
            date_of_birth: patient.date_of_birth,
            work: patient.work,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            console.log("Patient updated successfully : ", response.data);
            toast.success("Patient updated successfully", {
              duration: 2000,
            });
          }
        })
        .catch((error) => {
          toast.error("Error updating patient", { duration: 2000 });
          console.error("Error updating patient:", error);
        });
      fetchPatients?.();
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const savePatient = async (values: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/patients",
        {
          name: values.name,
          gender: values.gender,
          phone: values.phone,
          last_education: values.last_education,
          place_of_birth: values.place_of_birth,
          date_of_birth: values.date_of_birth,
          work: values.work,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Patient saved successfully", { duration: 2000 });
        closeModal();
        fetchPatients?.();
      } else {
        toast.error("Error saving patient", { duration: 2000 });
      }
    } catch (error) {
      throw error;
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: patient?.name || "",
      gender: patient?.gender || "",
      phone: patient?.phone || "",
      last_education: patient?.last_education || "",
      place_of_birth: patient?.place_of_birth || "",
      date_of_birth: patient?.date_of_birth
        ? patient.date_of_birth.split("T")[0]
        : "",
      work: patient?.work || "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required"),
      gender: yup.string().required("Gender is required"),
      phone: yup
        .number()
        .typeError("Phone number must be a number")
        .required("Phone number is required"),
      last_education: yup.string().required("Last education is required"),
      place_of_birth: yup.string().required("Place of birth is required"),
      date_of_birth: yup.string().required("Date of birth is required"),
      work: yup.string().required("Work is required"),
    }),
    // validate: (values) => {
    //   const errors: any = {};
    //   if (!values.name) {
    //     errors.name = "Name is required";
    //   }
    //   return errors;
    // },
    onSubmit: (values) => {
      if (openFormSelectPatient) {
        if (!patient) {
          setPatient(values);
        }
      } else {
        console.log("CREATED PATIENT");
        if (patient) {
          console.log("UPDATE PATIENT");
          const updatedPatient = {
            ...patient,
            name: values.name,
            gender: values.gender,
            phone: values.phone,
            last_education: values.last_education,
            place_of_birth: values.place_of_birth,
            date_of_birth: values.date_of_birth,
            work: values.work,
          };
          updatePatient(updatedPatient);
        } else {
          savePatient(values);
        }
      }
      closeModal();
    },
  });

  return (
    <div
      onClick={closeModal}
      className={`fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 z-40 transition-opacity duration-300 ${
        form ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backdropFilter: "blur(5px)", background: "rgba(0, 0, 0, 0.2)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-1/2 left-1/2 transform bg-white rounded-xl p-8 z-50 w-4xl h-[600px] transition-all duration-300 ease-in-out
    ${
      form
        ? "opacity-100 scale-100 translate-x-[-50%] translate-y-[-50%]"
        : "opacity-0 scale-95 translate-x-[-50%] translate-y-[-40%]"
    }
  `}
      >
        <div className="flex flex-row justify-between mb-8">
          <p className="text-2xl font-semibold">
            {patient ? "Edit patient" : "Create new patient"}
          </p>
          {!openFormSelectPatient ? (
            <button onClick={closeModal}>
              <img src={closeIcon} alt="" className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={openFormSelectPatient}>
              <div className="flex flex-row gap-2 items-center shadow-[0px_4px_4px_rgba(0,0,0,0.3)] bg-[#14f536] hover:bg-[#A4FFB1] px-4 py-2 rounded-3xl">
                <img src={patients} alt="" className="w-6 h-6" />
                <p>Select patient</p>
              </div>
            </button>
          )}
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
                option={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
                onChange={(value) => formik.setFieldValue("gender", value)}
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
                name="work"
                label="Work"
                placeholder="Input work"
                onChange={formik.handleChange}
                value={formik.values.work}
                onTouch={formik.touched.work}
                onError={formik.errors.work}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={buttonLoading}
              className="px-4 py-2 bg-blue-white border-blue-700 text-blue-700 border-2 rounded-full w-xs mt-8 disabled:bg-red-500 "
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
