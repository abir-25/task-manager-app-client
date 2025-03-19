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
    <>
      <div className="flex items-center gap-2 mt-5">
        <Wallet className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">This months Tasks</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-4">
        {taskStatusReport.length > 0 &&
          taskStatusReport.map((task) => (
            <Card key={task.status} className="h-full mt-4 py-3">
              <CardHeader>
                <p className="text-md font-semibold">{task.status}</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{task.count}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
};
