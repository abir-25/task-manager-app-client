import { TaskStatusReportResponse } from "@/types/api-response.types";
import { toast } from "react-toastify";
import { apiPrivateClient } from "./httpModule/client";
import { HttpService } from "./httpModule/httpModule";

class DashboardService {
  constructor(private http: HttpService) {}

  async getDashboardData() {
    const result = await this.http.post<TaskStatusReportResponse>(
      `get-task-status-report`
    );
    if (result.status) {
      return result.data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }
}

export const dashboardService = new DashboardService(apiPrivateClient);
