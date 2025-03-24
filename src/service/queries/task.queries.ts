import {
  CreateTaskDTO,
  getTaskInfoDTO,
  UpdateTaskDTO,
  UpdateTaskPosition,
} from "@/types/api.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { taskService } from "../task.service";
import { TaskInfo } from "@/types/types";
import { appQueryClient } from "@/lib/reactQueryClient";

export const GET_TASK_LIST = "GET_TASK_LIST";
export const GET_TASK_INFO_BY_ID = "GET_TASK_INFO_BY_ID";

const useGetTaskList = (payload: getTaskInfoDTO) => {
  return useQuery({
    queryKey: [GET_TASK_LIST, payload.status, payload.dueDate, payload.search],
    queryFn: () => taskService.getAllTask(payload),
    select: (data) => {
      const toDoTasks = data.filter((task) => task.status === "To Do");
      const inProgressTasks = data.filter(
        (task) => task.status === "In Progress"
      );
      const doneTasks = data.filter((task) => task.status === "Done");
      return {
        todo: toDoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
      };
    },
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

const useUpdateTaskPosition = () => {
  return useMutation({
    mutationFn: (payload: UpdateTaskPosition) =>
      taskService.updateTaskPosition(payload),
  });
};

export const optimisticUpdateSubTask = (data: TaskInfo) => {
  const KEY = [GET_TASK_LIST];

  appQueryClient.setQueriesData<TaskInfo[]>({ queryKey: KEY }, (prevData) => {
    if (!prevData) return;
    return prevData.map((task) => {
      if (task.id === data.id) {
        return data;
      }
      return task;
    });
  });
};

export const taskQueryService = {
  useGetTaskList,
  useGetTaskInfoByID,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskPosition,
};
