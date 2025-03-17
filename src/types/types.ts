export interface UserInfo {
  id: number;
  username: string;
  name: string | "";
  phone: string | "";
  status: string;
  jwToken: string;
  profileImgUrl: string | null;
  createDate: string;
  updatedDate: string | null;
}

export enum StatusEnum {
  ToDo = "To Do",
  InProgress = "In Progress",
  Done = "Done",
}

export type TaskInfo = {
  id: number;
  userId: number;
  name: string;
  description: string;
  status: string;
  dueDate: string;
  createDate: string;
  updatedDate: string | null;
};
