import { DataTable } from "@/components/data-table";
import Page from "@/components/layouts/main-layout.tsx";

import data from "../assets/utils/data.json";

export default function HistoryMeasurement() {
  return (
    <Page>
      <DataTable data={data} />
    </Page>
  );
}
