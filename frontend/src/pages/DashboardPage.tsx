import MainLayout from "@/components/layouts/main-layout.tsx";

export default function DashboardPage() {
  return (
    <MainLayout title="Dashboard">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between mx-8">
          <div className="">
            <p className="text-3xl font-bold">Dashboard</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
