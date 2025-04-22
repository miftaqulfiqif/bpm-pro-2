import { useFormik } from "formik";
import * as yup from "yup";
import passwordIcon from "@/assets/icons/password-icon.png";
import { MdPassword } from "react-icons/md";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

type Props = {
  form: boolean;
  closeModal: () => void;
  state: string;
  changeProfil: (id: string, values: any) => void;

  name: string;
};

export const ConfirmDelete = ({
  form,
  closeModal,
  state,
  changeProfil,
  name,
}: Props) => {
  const { user, login } = useAuth();

  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: yup.object().shape({
      password: yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      const dataUpdate = {
        name: name,
        password: values.password,
      };
      if (state === "Edit Profile") {
        user && changeProfil(user.id, dataUpdate);
      }
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
        className={`fixed top-1/2 left-1/2 transform bg-white rounded-xl p-8 z-50 w-2xl h-fit transition-all duration-300 ease-in-out
        ${
          form
            ? "opacity-100 scale-100 translate-x-[-50%] translate-y-[-50%]"
            : "opacity-0 scale-95 translate-x-[-50%] translate-y-[-40%]"
        }
      `}
      >
        <p className="text-xl font-semibold mb-4">
          Please enter password to confirm changes
        </p>
        {message && <p className="text-sm text-red-500">{message}</p>}
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="flex flex-row gap-3 items-center border py-4 px-4 rounded-xl ">
            <MdPassword />
            <input
              type="password"
              name="password"
              placeholder="Input Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="outline-none"
            />
          </div>
          <p className="text-sm text-red-500">{formik.errors.password}</p>
          <button
            type="submit"
            className="bg-[#0D00FF] text-white py-3 rounded-xl cursor-pointer mt-10"
          >
            Confirm changes
          </button>
        </form>
      </div>
    </div>
  );
};
