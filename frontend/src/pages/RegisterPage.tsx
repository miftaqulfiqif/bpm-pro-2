import { useRegisterForm } from "../hooks/UserRegisterForm";
export const RegisterPage = () => {
  const formik = useRegisterForm();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="border p-10">
        <p className="text-3xl font-bold">Register Page</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2 mt-10">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan name"
              className="border rounded pl-2"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-500">{formik.errors.name}</p>
            )}

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

          <div className="flex flex-col mt-10 gap-2">
            <button type="submit" className="border">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
