import { DataTable } from "@/components/data-table";
import MainLayout from "@/components/layouts/main-layout.tsx";

import data from "../assets/utils/data.json";

export default function HistoryMeasurement() {
  return (
    <MainLayout title="History Measurement">
      <DataTable data={data} />
    </MainLayout>
  );
}
