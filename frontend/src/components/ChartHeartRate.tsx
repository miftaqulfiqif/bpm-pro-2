import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCounter } from "../hooks/Counter";

export default function BasicLineChart() {
  const { heartRps } = useCounter();

  const [items, setItems] = React.useState<{ id: number; value: number }[]>([]);
  const [width, setWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth * 0.8);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: prevItems.length,
        value: heartRps,
      },
    ]);
  };

  return (
    <div className="mx-auto text-center">
      <button
        onClick={addItem}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Tambah Data
      </button>
      <LineChart
        xAxis={[{ data: items.map((item) => item.id) }]}
        series={[
          {
            data: items.map((item) => item.value),
          },
        ]}
        width={width}
        height={300}
      />
    </div>
  );
}
