import { Navbar } from "../navbar";
import { Toaster } from "../ui/sonner";

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function MainLayout({ children, title }: Props) {
  return (
    <>
      <Navbar title={title} />
      <div className="bg-[#ECECEC] h-full px-10 py-3 ">{children}</div>
      <Toaster />
    </>
  );
}
