"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartData = {
  month: string;
  systolic: number;
  diastolic: number;
};

const chartConfig = {
  systolic: {
    label: "Systolic",
    color: "hsl(var(--chart-1))",
  },
  diastolic: {
    label: "Diastolic",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Component({ chartData }: { chartData: ChartData[] }) {
  return (
    <Card className="border-none shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {" "}
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="systolic"
              type="natural"
              fill="blue"
              fillOpacity={0.4}
              stroke="blue"
              stackId="a"
            />
            <Area
              dataKey="diastolic"
              type="natural"
              fill="red"
              fillOpacity={0.4}
              stroke="red"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
