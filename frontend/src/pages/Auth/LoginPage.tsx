import { useLoginForm } from "../../hooks/UserLoginForm";

import usernameIcon from "@/assets/icons/profile-icon.png";
import passwordIcon from "@/assets/icons/password-icon.png";
import { useState } from "react";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export const LoginPage = () => {
  const formik = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#ECECEC]">
      <div className="flex flex-row w-[1080px] h-[720px] mx-auto bg-white rounded-2xl p-4 gap-4">
        <div className="w-1/2 h-full bg-[#0D00FF] rounded-2xl"></div>
        <div className="w-1/2 p-10 flex items-center">
          <div className="flex flex-col w-full">
            <p className="text-3xl font-bold">Log In</p>
            <p className="text-sm text-red-500">{formik.status}</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-2 mt-10">
                <div className="w-full">
                  <p className="text-lg ml-1 mb-2">Username</p>
                  <div className="flex items-center gap-2 border rounded-xl px-2 py-2 focus-within:border-[#0D00FF]">
                    <img src={usernameIcon} alt="" className="ml-2 w-5 h-5" />
                    <label htmlFor="username" className="w-full">
                      <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Masukkan Username"
                        className="w-full focus:outline-none"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                      />
                    </label>
                  </div>
                  {formik.touched.username && formik.errors.username && (
                    <p className="text-sm text-red-500">
                      {formik.errors.username}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <p className="text-lg ml-1 mb-2">Password</p>
                  <div className="flex items-center gap-2 border rounded-xl px-2 py-2 focus-within:border-[#0D00FF]">
                    <img src={passwordIcon} alt="" className="ml-2 w-5 h-5" />
                    <label htmlFor="password" className="w-full">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Masukkan Password"
                        className="w-full focus:outline-none"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none mr-2"
                    >
                      {showPassword ? (
                        <FaRegEyeSlash className="w-5 h-5 text-gray-700" />
                      ) : (
                        <FaRegEye className="w-5 h-5 text-gray-700" />
                      )}
                    </button>
                  </div>

                  {formik.touched.password && formik.errors.password && (
                    <p className="text-sm text-red-500">
                      {formik.errors.password}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="mt-10 flex items-center justify-center mx-auto w-full bg-[#0D00FF] text-white py-2 px-4 rounded-lg font-semibold"
              >
                Log in
              </button>
            </form>
            <div className="flex gap-2 mt-2 mx-auto">
              <p className="">Don’t have an account yet?</p>
              <a href="/register" className="text-[#0D00FF] hover:underline">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
