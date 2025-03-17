import { CreateTaskDTO, getTaskInfoDTO, UpdateTaskDTO } from "@/types/api.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { taskService } from "../task.service";

export const GET_TASK_LIST = "GET_TASK_LIST";
export const GET_TASK_INFO_BY_ID = "GET_TASK_INFO_BY_ID";

const useGetTaskList = (payload: getTaskInfoDTO) => {
  return useQuery({
    queryKey: [GET_TASK_LIST],
    queryFn: () => taskService.getAllTask(payload),
  });
};

const useGetTaskInfoByID = (taskId: number) => {
  return useQuery({
    queryKey: [GET_TASK_INFO_BY_ID, taskId],
    queryFn: () => taskService.getTaskInfo(taskId),
    enabled: !!taskId,
  });
};

const useCreateTask = () => {
  return useMutation({
    mutationFn: (formData: CreateTaskDTO) => taskService.createTask(formData),
  });
};

const useUpdateTask = () => {
  return useMutation({
    mutationFn: (formData: UpdateTaskDTO) => taskService.updateTask(formData),
  });
};

const useDeleteTask = () => {
  return useMutation({
    mutationFn: (taskId: number) => taskService.deleteTask(taskId),
  });
};

export const taskQueryService = {
  useGetTaskList,
  useGetTaskInfoByID,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
};
