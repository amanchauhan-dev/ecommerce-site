"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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
const chartData = [
  { category: "cloth", visitors: 275, fill: "var(--color-cloth)" },
  { category: "accessories", visitors: 200, fill: "var(--color-accessories)" },
  { category: "bag", visitors: 187, fill: "var(--color-bag)" },
  { category: "gadget", visitors: 173, fill: "var(--color-gadget)" },
  { category: "furniture", visitors: 90, fill: "var(--color-furniture)" },
  { category: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  accessories: {
    label: "Accessories",
    color: "red",
  },
  bag: {
    label: "Bag",
    color: "indigo",
  },
  cloth: {
    label: "Cloth",
    color: "blue",
  },
  gadget: {
    label: "Gadget",
    color: "green",
  },
  furniture: {
    label: "Furniture",
    color: "orange",
  },
  other: {
    label: "Other",
    color: "indigo",
  },
} satisfies ChartConfig;

export function PieChartComponent({ className = "" }: { className?: string }) {
  return (
    <Card
      className={`flex flex-col flex-auto min-w-[250px] h-fit ${className}`}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle>Most Sold Category</CardTitle>
        <CardDescription>This Month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto  aspect-square max-h-[250px]  [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="category"
                fill="white"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
