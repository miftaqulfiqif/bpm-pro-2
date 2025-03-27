import { useLoginForm } from "../../hooks/UserLoginForm";

export const LoginPage = () => {
  const formik = useLoginForm();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="border p-10">
        <p className="text-3xl font-bold">Login Page</p>

        <p className="text-sm text-red-500">{formik.status}</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2 mt-10">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Masukkan Username"
              className="border rounded pl-2"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-sm text-red-500">{formik.errors.username}</p>
            )}

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan Password"
              className="border rounded pl-2"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="mt-2 flex items-center justify-center mx-auto bg-slate-800 text-white py-1 px-4 rounded-xl"
          >
            Login
          </button>
        </form>
        <a href="/register" className="mt-10">
          Register
        </a>
      </div>
    </div>
  );
};
