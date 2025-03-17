import { UpdateUserProfileFormType } from "@/pages/User/components/UserProfileForm/types";
import { UserInfo } from "@/types/types";
import { toast } from "react-toastify";
import { apiPrivateClient } from "./httpModule/client";
import { HttpService } from "./httpModule/httpModule";

class UserService {
  constructor(private http: HttpService) {}

  async getUserInfo() {
    const result = await this.http.post<UserInfo>(`get-user-info`);
    if (result.status) {
      return result.data;
    }
    throw new Error(result.message);
  }

  async updateUserInfo(payload: UpdateUserProfileFormType) {
    const result = await this.http.postForm<UserInfo>(`update-user`, payload);
    if (result.status) {
      toast.success(result.message);
      return result.data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }
}

export const userService = new UserService(apiPrivateClient);
