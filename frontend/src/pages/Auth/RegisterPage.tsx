import { useRegisterForm } from "../../hooks/UserRegisterForm";
import usernameIcon from "@/assets/icons/profile-icon.png";
import passwordIcon from "@/assets/icons/password-icon.png";

export const RegisterPage = () => {
  const formik = useRegisterForm();
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#ECECEC]">
      <div className="flex flex-row w-[1080px] h-[720px] mx-auto bg-white rounded-2xl p-4 gap-4">
        <div className="w-1/2 h-full bg-[#0D00FF] rounded-2xl"></div>
        <div className="w-1/2 p-10 flex items-center">
          <div className="flex flex-col w-full">
            <p className="text-3xl font-bold">Register</p>
            <p className="text-sm text-red-500">{formik.status}</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-2 mt-10">
                {/* Name */}
                <div className="w-full">
                  <p className="text-lg ml-1 mb-2">Name</p>
                  <div className="flex items-center gap-2 border rounded-xl px-2 py-2 focus-within:border-[#0D00FF]">
                    <img src={usernameIcon} alt="" className="ml-2 w-5 h-5" />
                    <label htmlFor="name" className="w-full">
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Input your full name"
                        className="w-full focus:outline-none"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                      />
                    </label>
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-red-500">{formik.errors.name}</p>
                  )}
                </div>

                {/* Username */}
                <div className="w-full">
                  <p className="text-lg ml-1 mb-2">Username</p>
                  <div className="flex items-center gap-2 border rounded-xl px-2 py-2 focus-within:border-[#0D00FF]">
                    <img src={usernameIcon} alt="" className="ml-2 w-5 h-5" />
                    <label htmlFor="username" className="w-full">
                      <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Input your username"
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

                {/* Password */}
                <div className="w-full">
                  <p className="text-lg ml-1 mb-2">Password</p>
                  <div className="flex items-center gap-2 border rounded-xl px-2 py-2 focus-within:border-[#0D00FF]">
                    <img src={passwordIcon} alt="" className="ml-2 w-5 h-5" />
                    <label htmlFor="password" className="w-full">
                      <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Input yout password"
                        className="w-full focus:outline-none"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                    </label>
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
                Register
              </button>
            </form>

            <div className="flex gap-2 mt-2 mx-auto">
              <p className="">Already have an account?</p>
              <a href="/login" className="text-[#0D00FF] hover:underline">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
