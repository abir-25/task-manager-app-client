import { dashboardQueries } from "@/service/queries/dasboard.queries";
import { useGlobalStore } from "@/store/global-store";
import { TaskStatusReportSkeleton } from "./components/DashboardSkeleton";
import { TaskStatusReport } from "./components/TaskStatusReport/TaskStatusReport";

export const Dashboard = () => {
  const userName = useGlobalStore((s) => s.userInfo?.name);
  const { data: taskStatusReport, isLoading: isTaskStatusReportLoading } =
    dashboardQueries.useGetTaskStatusReportData();
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/5 p-4 rounded-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Welcome back</span>
            {userName ? `, ${userName}! 👋` : " 👋"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here's an overview of your task manager app dashboard
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 grid-cols-12">
          <div className="col-span-12 md:col-span-12">
            {isTaskStatusReportLoading ? (
              <TaskStatusReportSkeleton />
            ) : (
              <TaskStatusReport taskStatusReport={taskStatusReport || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
