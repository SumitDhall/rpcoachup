
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { metrics } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Users, Music, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  'Total Dancers': Users,
  'Active Classes': Music,
  'Peak Score': Star,
  'Rehearsal Hours': Clock,
};

export function MetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.title as keyof typeof iconMap] || Users;
        return (
          <Card key={metric.title} className="glass-card transition-all hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="rounded-full bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="flex items-center text-xs mt-1">
                <span className={cn(
                  "mr-1 flex items-center font-medium",
                  metric.trend === 'up' ? "text-emerald-400" : "text-rose-400"
                )}>
                  {metric.trend === 'up' ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                  {metric.change}
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
