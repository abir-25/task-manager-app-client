import { CreateTaskFormType } from "@/pages/TaskManagement/components/CreateTaskModals/types";

export type CreateTaskDTO = CreateTaskFormType;

export type UpdateTaskDTO = CreateTaskFormType & {
  id: number;
};

export type getTaskInfoDTO = {
  status: string;
  dueDate: string;
};
