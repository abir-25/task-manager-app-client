import { SignupFormType } from "@/pages/Auth/Signup/types";
import { UserInfo } from "@/types/types";
import { toast } from "react-toastify";
import { apiPublicClient } from "./httpModule/client";
import { HttpService } from "./httpModule/httpModule";

class AuthService {
  constructor(private http: HttpService) {}

  async signUp(payload: SignupFormType) {
    const result = await this.http.post<UserInfo>(`signup`, payload);

    if (result.status) {
      toast.success(result.message);
      return result.data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }

  async login(payload: SignupFormType) {
    const result = await this.http.post<UserInfo>(`login`, payload);
    if (result.status) {
      toast.success(result.message);
      return result.data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }

  async verifyEmail(emailVerifyToken: string) {
    const result = await this.http.post<{ data: any }>(`email-verify`, {
      emailVerifyToken,
    });
    if (result.status) {
      toast.success(result.message);

      const data = result.data;
      return data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }

  async resendVerifyEmail(userId: number) {
    const result = await this.http.post<{ data: any }>(`resend-verify-email`, {
      userId,
    });
    if (result.status) {
      const data = result.data;

      toast.success(result.message);
      return data;
    }

    toast.error(result.message);
    throw new Error(result.message);
  }

  async getUserDetailsByInviteHash(inviteHash: string) {
    console.log({ inviteHash });
    const result = await this.http.get<UserInfo>(`invitation/${inviteHash}`);
    if (result.status) {
      return result.data;
    }

    throw new Error(result.message);
  }
}

export const authService = new AuthService(apiPublicClient);
