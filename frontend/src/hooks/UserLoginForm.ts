import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginUser = () => {
    axios
      .post("http://localhost:3000/api/users/login", formik.values)
      .then((response) => {
        if (response.status === 200) {
          const token = response.data.data.token;
          const user = response.data.data.user;
          login(token, user);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        formik.setStatus(error.response.data.errors);
      });
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
