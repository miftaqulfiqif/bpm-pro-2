import { useFormik } from "formik";
import * as yup from "yup";
import { InputText } from "./Forms/FormsInput/InputText";

type NewCategoryProps = {
  form: boolean;
  closeModal: () => void;
};

export const NewCategory = ({ form, closeModal }: NewCategoryProps) => {
  const formik = useFormik({
    initialValues: {
      min_systolic: "",
      max_systolic: "",
      min_diastolic: "",
      max_diastolic: "",
    },
    validationSchema: yup.object().shape({
      min_systolic: yup
        .number()
        .typeError("Min systolic must be a number")
        .required("Min systolic is required"),
      max_systolic: yup
        .number()
        .typeError("Min systolic must be a number")
        .required("Max systolic is required"),
      min_diastolic: yup
        .number()
        .typeError("Min systolic must be a number")
        .required("Min diastolic is required"),
      max_diastolic: yup
        .number()
        .typeError("Min systolic must be a number")
        .required("Max diastolic is required"),
    }),
    onSubmit: (values) => {
      alert(values);
    },
  });

  return (
    <div
      onClick={closeModal}
      className={`fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 z-40 ${
        form ? "" : "hidden"
      }`}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-10 z-50 max-w-[900px]"
      >
        <div className="flex flex-row justify-between mb-8">
          <p className="text-2xl">Add New Category Result</p>
        </div>
        <form onSubmit={formik.handleSubmit}>
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
            <p>Min</p>
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
            <p>Min</p>
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
