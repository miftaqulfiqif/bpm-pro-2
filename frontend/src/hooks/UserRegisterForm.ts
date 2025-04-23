import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

export const useRegisterForm = () => {
  const registerUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users",
        formik.values
      );

      if (response.status === 200) {
        window.location.href = "/login";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          formik.setStatus(error.response.data.errors);
        } else {
          formik.setStatus("An error occurred, please try again.");
        }
      } else {
        formik.setStatus("Unexpected error occurred.");
      }
    }
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
