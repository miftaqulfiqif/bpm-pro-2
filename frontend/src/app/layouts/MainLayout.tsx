import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar.tsx";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-blue-500 text-white">
      <AppSidebar />
      <main className="bg-white w-full text-black">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
