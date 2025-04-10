import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Navbar } from "../navbar";

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function MainLayout({ children, title }: Props) {
  return (
    <>
      <Navbar title={title} />
      <div className="bg-[#ECECEC] h-full p-10">{children}</div>
    </>
  );
}
