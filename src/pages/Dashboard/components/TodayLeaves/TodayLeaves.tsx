import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GetDashboardDataApiResponse } from "@/types/api-response.types";
import { Calendar, Clock } from "lucide-react";

interface TodayLeavesProps {
  todayLeaves: GetDashboardDataApiResponse["todayLeaves"];
}

export const TodayLeaves = ({ todayLeaves }: TodayLeavesProps) => {
  return (
    <Card className="shadow-md h-full flex flex-col">
      <CardHeader className="flex-none">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Today's Leaves</h2>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          {todayLeaves.length > 0 ? (
            <div className="space-y-3 pr-4">
              {todayLeaves.map((leave) => (
                <div
                  key={leave.userLeaveId}
                  className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors border border-border/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary text-sm font-medium">
                      {leave.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{leave.name}</p>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {leave.isHalfDay ? "Half Day" : "Full Day"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="truncate">{leave.designation}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {leave.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[380px] flex flex-col items-center justify-center text-muted-foreground">
              <Calendar className="w-10 h-10 mb-2 text-primary/40" />
              <p className="font-medium text-sm">No Leaves Today</p>
              <p className="text-xs">Everyone is present today</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 