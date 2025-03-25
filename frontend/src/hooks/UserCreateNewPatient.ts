import { useFormik } from "formik";
import * as yup from "yup";
import { useCounter } from "./Counter";

export const useCreateNewPatient = () => {
  const { buttonStart } = useCounter();

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "",
      phone: "",
      last_education: "",
      place_of_birth: "",
      date_of_birth: "",
      address: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required"),
      gender: yup.string().required("Gender is required"),
      phone: yup.number().required("Phone is required"),
      last_education: yup.string().required("Last education is required"),
      place_of_birth: yup.string().required("Place of birth is required"),
      date_of_birth: yup.string().required("Date of birth is required"),
      address: yup.string().required("Address is required"),
    }),
    // validate: (values) => {
    //   const errors: any = {};
    //   if (!values.name) {
    //     errors.name = "Name is required";
    //   }
    //   return errors;
    // },
    onSubmit: (values) => {
      console.log(values);
      buttonStart();
    },
  });

  return formik;
};
