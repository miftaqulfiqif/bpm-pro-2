import { useFormik } from "formik";
import * as yup from "yup";
import { InputText } from "./Forms/FormsInput/InputText";
import axios from "axios";

import closeIcon from "@/assets/icons/close.png";

type NewCategoryProps = {
  form: boolean;
  closeModal: () => void;
  fetchCategories: () => void;
};

export const NewCategory = ({
  form,
  closeModal,
  fetchCategories,
}: NewCategoryProps) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      min_systolic: "",
      max_systolic: "",
      min_diastolic: "",
      max_diastolic: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Category name is required"),
      description: yup.string().required("Description is required"),
      min_systolic: yup
        .number()
        .typeError("Min systolic must be a number")
        .required("Min systolic is required"),
      max_systolic: yup
        .number()
        .typeError("Max systolic must be a number")
        .required("Max systolic is required"),
      min_diastolic: yup
        .number()
        .typeError("Min diastolic must be a number")
        .required("Min diastolic is required"),
      max_diastolic: yup
        .number()
        .typeError("Max diastolic must be a number")
        .required("Max diastolic is required"),
    }),
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const handleSave = async (values: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/category-results",
        {
          name: values.name,
          description: values.description,
          min_systolic: values.min_systolic,
          max_systolic: values.max_systolic,
          min_diastolic: values.min_diastolic,
          max_diastolic: values.max_diastolic,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        closeModal();
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        className={`fixed top-1/2 left-1/2 transform bg-white rounded-xl p-8 z-50 w-fit h-[600px] transition-all duration-300 ease-in-out
    ${
      form
        ? "opacity-100 scale-100 translate-x-[-50%] translate-y-[-50%]"
        : "opacity-0 scale-95 translate-x-[-50%] translate-y-[-40%]"
    }
  `}
      >
        <div className="flex flex-row justify-between mb-8">
          <p className="text-2xl">Add New Category Result</p>
          <button onClick={closeModal}>
            <img src={closeIcon} alt="" className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col mb-4 ">
            <p className="font-semibold">Category Name</p>
            <InputText
              name="name"
              type="text"
              placeholder="Input category name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onTouch={formik.touched.name}
              onError={formik.errors.name}
            />
          </div>
          <div className="flex flex-col mb-6 ">
            <p className="font-semibold">Description</p>
            <InputText
              name="description"
              type="text"
              placeholder="Input description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onTouch={formik.touched.description}
              onError={formik.errors.description}
              className="h-20 bg-gray-100"
            />
          </div>
          <p className="font-semibold mb-2">Systolic</p>
          <div className="flex flex-row justify-between gap-2 mb-6 items-center">
            <p>Min</p>
            <p>:</p>{" "}
            <InputText
              name="min_systolic"
              type="number"
              placeholder="Input min systolic"
              value={formik.values.min_systolic}
              onChange={formik.handleChange}
              onTouch={formik.touched.min_systolic}
              onError={formik.errors.min_systolic}
            />
            <p>Max</p>
            <p>:</p>{" "}
            <InputText
              name="max_systolic"
              type="number"
              placeholder="Input max systolic"
              value={formik.values.max_systolic}
              onChange={formik.handleChange}
              onTouch={formik.touched.max_systolic}
              onError={formik.errors.max_systolic}
            />
          </div>
          <p className="font-semibold mb-2">Diastolic</p>
          <div className="flex flex-row justify-between gap-2 items-center">
            <p>Min</p>
            <p>:</p>
            <InputText
              name="min_diastolic"
              type="number"
              placeholder="Input min diastolic"
              value={formik.values.min_diastolic}
              onChange={formik.handleChange}
              onTouch={formik.touched.min_diastolic}
              onError={formik.errors.min_diastolic}
            />
            <p>Max</p>
            <p>:</p>{" "}
            <InputText
              name="max_diastolic"
              type="number"
              placeholder="Input max diastolic"
              value={formik.values.max_diastolic}
              onChange={formik.handleChange}
              onTouch={formik.touched.max_diastolic}
              onError={formik.errors.max_diastolic}
            />
          </div>
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-white border-blue-700 text-blue-700 border-2 rounded-full w-xs"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
