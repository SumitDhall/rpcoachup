
"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { performanceData } from "@/lib/mock-data";

export function PerformanceCharts() {
  return (
    <Card className="glass-card col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-headline">Performance Trend</CardTitle>
        <CardDescription>Visualizing dancer growth and attendance metrics over the past 7 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            performance: {
              label: "Performance Score",
              color: "hsl(var(--chart-1))",
            },
            attendance: {
              label: "Attendance %",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="performance"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPerf)"
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAttend)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
