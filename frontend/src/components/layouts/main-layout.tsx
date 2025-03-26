import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar variant="floating" className="bg-black" />
      <SidebarInset className="bg-[#f9f9f9] ">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 p-4 m-2 rounded-xl shadow-2xl">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
