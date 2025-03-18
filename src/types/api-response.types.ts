export interface TaskStatusReportResponseEntity {
  status: string;
  count: number;
}

export interface GetDashboardDataApiResponse {
  taskStatusReport: TaskStatusReportResponseEntity[];
}
