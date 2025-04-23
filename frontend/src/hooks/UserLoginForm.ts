import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        formik.values,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const user = response.data;
        login(user);
        navigate("/measurement");
      } else {
        formik.setStatus(response.data.errors || "Login failed.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          formik.setStatus(
            error.response.data.message || "Invalid credentials"
          );
        } else {
          formik.setStatus("Network error, please try again.");
        }
      } else {
        formik.setStatus("Unexpected error occurred.");
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      username: yup.string().required("Username is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: loginUser,
  });

  return formik;
};
