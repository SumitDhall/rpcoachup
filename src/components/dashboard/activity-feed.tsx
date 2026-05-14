
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activities } from "@/lib/mock-data";
import { Upload, Trophy, Music, RefreshCw, Share2 } from "lucide-react";

const iconMap = {
  upload: Upload,
  milestone: Trophy,
  class: Music,
  share: Share2,
  update: RefreshCw,
};

export function ActivityFeed() {
  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="text-headline">Activity Stream</CardTitle>
        <CardDescription>Recent rhythmic pulses from the Dance Verse universe.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => {
            const Icon = iconMap[activity.type as keyof typeof iconMap] || RefreshCw;
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={`https://picsum.photos/seed/${activity.user}/100/100`} />
                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 ring-2 ring-primary">
                    <Icon className="h-3 w-3 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium text-foreground">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
