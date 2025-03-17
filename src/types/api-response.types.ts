import { UserInfo } from "./types";

export interface LoginApiResponse {
  userInfo: UserInfo;
}

export interface TaskStatusReportResponse {
  toDoTaskCount: number;
  inProgressTaskCount: number;
  doneTaskCount: number;
}
