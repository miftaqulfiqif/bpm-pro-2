import { useFormik } from "formik";
import * as yup from "yup";
import { InputText } from "./Forms/FormsInput/InputText";
import axios from "axios";

import closeIcon from "@/assets/icons/close.png";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [genderChecked, setGenderChecked] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category_color: "#0D00FF",
      age_required: false,
      gender_required: false,
      min_age: "",
      max_age: "",
      gender: "any",
      min_systolic: "",
      max_systolic: "",
      min_diastolic: "",
      max_diastolic: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Category name is required"),
      description: yup.string().required("Description is required"),
      category_color: yup.string().required("Category color is required"),
      min_age: yup
        .number()
        .typeError("Min age must be a number")
        .when("age_required", {
          is: true,
          then: (schema) =>
            schema
              .required("Min age is required")
              .min(0, "Min age must be at least 0"),
          otherwise: (schema) => schema.notRequired(),
        }),
      max_age: yup
        .number()
        .typeError("Max age must be a number")
        .when("age_required", {
          is: true,
          then: (schema) =>
            schema
              .required("Max age is required")
              .min(
                yup.ref("min_age"),
                "Max age must be greater than or equal to min age"
              ),
          otherwise: (schema) => schema.notRequired(),
        }),

      gender: yup.string().when("gender_required", {
        is: true,
        then: (schema) => schema.required("Gender is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

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
      console.log(values);
      // handleSave(values);
    },
  });

  useEffect(() => {
    if (!formik.values.gender_required) {
      formik.setFieldValue("gender", "any", true);
    }
    if (!formik.values.age_required) {
      formik.setFieldValue("min_age", "");
      formik.setFieldValue("max_age", "");
    }
  }, [formik.values.gender_required]);

  const handleSave = async (values: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/category-results",
        {
          name: values.name,
          description: values.description,
          category_color: values.category_color,
          min_age: values.min_age,
          max_age: values.max_age,
          gender: genderChecked ? values.gender : "any",
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
        className={`fixed top-1/2 left-1/2 transform bg-white rounded-xl p-8 z-50 w-fit h-fit transition-all duration-300 ease-in-out
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
          <div className="flex flex-row gap-2">
            <div className="w-full flex flex-col mb-4 ">
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
            <div className="flex flex-col mb-4 gap-2 w-1/3">
              <p className="font-semibold">Category color</p>
              <input
                type="color"
                name="category_color"
                value={formik.values.category_color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-full rounded-lg"
              />
              {formik.touched.category_color &&
                formik.errors.category_color && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.category_color}
                  </p>
                )}
            </div>
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

          <div className="flex flex-col gap-4 mb-2">
            {/* Checkbox age */}
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="age_required"
                  name="age_required"
                  checked={formik.values.age_required}
                  onChange={() => {
                    formik.setValues({
                      ...formik.values,
                      age_required: !formik.values.age_required,
                    });
                    setAgeChecked(!ageChecked);
                  }}
                  className="hidden"
                />
                <div
                  className={`w-10 h-6 rounded-full p-1 relative overflow-hidden cursor-pointer ${
                    ageChecked ? `bg-blue-500` : `bg-gray-200`
                  }`}
                  onClick={() => {
                    formik.setValues({
                      ...formik.values,
                      age_required: !formik.values.age_required,
                    });
                    setAgeChecked(!ageChecked);
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded-full  shadow-md absolute top-1 left-1 transition-all duration-300 ${
                      ageChecked
                        ? "bg-white translate-x-4 "
                        : "bg-white translate-x-0"
                    }`}
                  ></div>
                </div>

                <label
                  htmlFor="age_required"
                  className="font-semibold cursor-pointer"
                >
                  Require Age
                </label>
              </div>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden p-1 ${
                  ageChecked
                    ? "max-h-40 opacity-100 scale-100"
                    : "max-h-0 opacity-0 scale-95 mt-0"
                }`}
              >
                <div className="flex flex-row gap-2">
                  <InputText
                    name="min_age"
                    type="number"
                    placeholder="Input min age"
                    value={formik.values.min_age}
                    onChange={formik.handleChange}
                    onTouch={formik.touched.min_age}
                    onError={formik.errors.min_age}
                  />
                  <InputText
                    name="max_age"
                    type="number"
                    placeholder="Input max age"
                    value={formik.values.max_age}
                    onChange={formik.handleChange}
                    onTouch={formik.touched.max_age}
                    onError={formik.errors.max_age}
                  />
                </div>
              </div>
            </div>

            {/* Checkbox gender */}
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="gender_required"
                name="gender_required"
                checked={formik.values.gender_required}
                onChange={() => {
                  formik.setValues({
                    ...formik.values,
                    gender_required: !formik.values.gender_required,
                  });
                  setGenderChecked(!genderChecked);
                }}
                className="hidden"
              />

              <div
                className={`w-10 h-6 rounded-full p-1 relative overflow-hidden cursor-pointer ${
                  genderChecked ? `bg-blue-500` : `bg-gray-200`
                }`}
                onClick={() => {
                  formik.setValues({
                    ...formik.values,
                    gender_required: !formik.values.gender_required,
                  });
                  setGenderChecked(!genderChecked);
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full  shadow-md absolute top-1 left-1 transition-all duration-300 ${
                    genderChecked
                      ? "bg-white translate-x-4 "
                      : "bg-white translate-x-0"
                  }`}
                ></div>
              </div>

              <label
                htmlFor="gender_required"
                className="font-semibold cursor-pointer"
              >
                Require Gender
              </label>
            </div>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden px-2 ${
                genderChecked
                  ? "max-h-40 opacity-100 scale-100"
                  : "max-h-0 opacity-0 scale-95"
              }`}
            >
              <div className="flex flex-row gap-1">
                <div className="flex flex-row gap-2 items-center">
                  <p>Gender</p>
                  <Select
                    value={formik.values.gender}
                    onValueChange={(value) =>
                      formik.setFieldValue("gender", value)
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-[rgba(117,195,255,0.5)] border-0">
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="male" className="hover:bg-gray-200">
                          Male
                        </SelectItem>
                        <SelectItem
                          value="female"
                          className="hover:bg-gray-200"
                        >
                          Female
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="text-sm text-red-500">
                      {formik.errors.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>
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
