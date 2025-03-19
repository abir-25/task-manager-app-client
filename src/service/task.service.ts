import { CreateTaskDTO, getTaskInfoDTO, UpdateTaskDTO } from "@/types/api.dto";
import { TaskInfo } from "@/types/types";
import { toast } from "react-toastify";
import { apiPrivateClient } from "./httpModule/client";
import { HttpService } from "./httpModule/httpModule";
import { WithUserID } from "./interface/WithUserId";

class TaskService extends WithUserID {
  constructor(private http: HttpService) {
    super();
  }

  async getAllTask(payload: getTaskInfoDTO) {
    const result = await this.http.get<TaskInfo[]>(
      `get-task-list?status=${payload.status ?? ""}&dueDate=${
        payload.dueDate ?? ""
      }&searchKey=${payload.search ?? ""}`
    );

    if (result.status) {
      return result.data;
    }
    throw new Error(result.message);
  }

  async getTaskInfo(taskId: number) {
    const result = await this.http.post<TaskInfo>(`get-task-info`, {
      taskId,
    });

    if (result.status) {
      return result.data;
    }
    throw new Error(result.message);
  }

  async createTask(payload: CreateTaskDTO) {
    const result = await this.http.post<TaskInfo>(`create-task`, payload);

    if (result.status) {
      toast.success(result.message);
      return result.data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }

  async updateTask(payload: UpdateTaskDTO) {
    const result = await this.http.post<TaskInfo>(`update-task`, payload);

    if (result.status) {
      toast.success(result.message);
      return result.data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }

  async deleteTask(taskId: number) {
    const result = await this.http.post<TaskInfo>(`delete-task`, {
      taskId,
    });

    if (result.status) {
      toast.success(result.message);
      return result.data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }
}

export const taskService = new TaskService(apiPrivateClient);
