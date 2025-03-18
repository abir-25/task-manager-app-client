import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GetDashboardDataApiResponse } from "@/types/api-response.types";
import { Wallet } from "lucide-react";

interface TaskStatusReportProps {
  taskStatusReport: GetDashboardDataApiResponse["taskStatusReport"];
}

export const TaskStatusReport = ({
  taskStatusReport,
}: TaskStatusReportProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">This months Tasks</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-4">
          {taskStatusReport.length > 0 &&
            taskStatusReport.map((task) => (
              <div
                key={task.status}
                className="relative overflow-hidden rounded-lg border p-3"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-md font-medium truncate">
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold tracking-tight">
                      {task.count}
                    </span>
                  </div>
                </div>
                {/* Background decoration */}
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
