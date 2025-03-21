import { CreateTaskFormType } from "@/pages/TaskManagement/components/CreateTaskModals/types";

export type CreateTaskDTO = CreateTaskFormType;

export type UpdateTaskDTO = CreateTaskFormType & {
  id: number;
};

export type UpdateTaskPosition = {
  activeId: number;
  overId: number;
};

export type getTaskInfoDTO = {
  status: string | undefined;
  dueDate: string | undefined;
  search: string | undefined;
};
