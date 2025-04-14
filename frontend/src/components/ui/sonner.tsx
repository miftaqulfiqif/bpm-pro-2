import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors={false}
      toastOptions={{
        classNames: {
          success:
            "!bg-green-500 bg-opacity-50 text-white border !border-green-700 shadow-lg px-4 py-3 rounded-md",
          error:
            "!bg-red-500 text-white border !border-red-700 shadow-lg px-4 py-3 rounded-md",
          info: "!bg-yellow-500 text-white border !border-yellow-700 shadow-lg px-4 py-3 rounded-md",
          warning:
            "!bg-orange-500 text-white border !border-orange-700 shadow-lg px-4 py-3 rounded-md",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
