import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

type ItemsResult = {
  items: any[];
};

export default function BasicLineChart(props: ItemsResult) {
  const { items } = props;

  const [width, setWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth * 0.3);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LineChart
      className=""
      xAxis={[{ data: items.map((item) => item.id) }]}
      series={[
        {
          data: items.map((item) => item.value),
        },
      ]}
      width={width}
      height={300}
      colors={["#3016F1"]}
    />
  );
}
