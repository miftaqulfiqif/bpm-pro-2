import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

export const useLoginForm = () => {
  const loginUser = () => {
    console.log(formik.values);
    axios
      .post("http://localhost:3000/api/users/login", formik.values)
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data.data.token);
          localStorage.setItem("token", response.data.data.token);

          window.location.href = "/measurement";
        }
      })
      .catch(function (error) {
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
