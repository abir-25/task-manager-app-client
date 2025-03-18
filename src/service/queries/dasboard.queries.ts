import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../dashboard.service";

export const GET_DASHBOARD_DATA = "GET_DASHBOARD_DATA";

const useGetTaskStatusReportData = () => {
  return useQuery({
    queryKey: [GET_DASHBOARD_DATA],
    queryFn: () => dashboardService.getTaskStatusReportData(),
  });
};

export const dashboardQueries = {
  useGetTaskStatusReportData,
};
