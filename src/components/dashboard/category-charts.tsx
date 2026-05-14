
"use client";

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { danceStyleData } from "@/lib/mock-data";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function CategoryCharts() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-headline">Style Popularity</CardTitle>
        <CardDescription>Breakdown of active dance styles across the platform.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            Contemporary: { label: "Contemporary", color: "hsl(var(--chart-1))" },
            "Hip Hop": { label: "Hip Hop", color: "hsl(var(--chart-2))" },
            Ballet: { label: "Ballet", color: "hsl(var(--chart-3))" },
            Jazz: { label: "Jazz", color: "hsl(var(--chart-4))" },
            Latin: { label: "Latin", color: "hsl(var(--chart-5))" },
          }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={danceStyleData}
              dataKey="count"
              nameKey="style"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              stroke="hsl(var(--card))"
            >
              {danceStyleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-4 mt-4 pb-4">
          {danceStyleData.map((item) => (
            <div key={item.style} className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-xs font-medium text-muted-foreground">{item.style}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
