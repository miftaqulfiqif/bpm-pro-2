import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

export const useRegisterForm = () => {
  const registerUser = () => {
    axios
      .post("http://localhost:3000/api/users", formik.values)
      .then(function (response) {
        console.log(response);
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
    },

    onSubmit: registerUser,
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required("Name is required")
        .min(3, "Too short")
        .max(100),
      username: yup
        .string()
        .required("Username is required")
        .min(3, "Too short")
        .max(100),
      password: yup
        .string()
        .required("Password is required")
        .min(3, "Too short")
        .max(100)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, and One Number"
        ),
    }),
  });
  return formik;
};
