import { SignupFormType } from "@/pages/Auth/Signup/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../auth.service";

const GET_USER_INFO_BY_HASH = "GET_USER_INFO_BY_HASH";

const useSignUp = () => {
  return useMutation({
    mutationFn: (payload: SignupFormType) => authService.signUp(payload),
  });
};

const useLogin = () => {
  return useMutation({
    mutationFn: (payload: SignupFormType) => authService.login(payload),
  });
};

const useGetUserByHash = (inviteHash: string) => {
  console.log({ inviteHash });
  return useQuery({
    queryKey: [GET_USER_INFO_BY_HASH, inviteHash],
    queryFn: () => authService.getUserDetailsByInviteHash(inviteHash),
  });
};

export const authQueryService = {
  useSignUp,
  useLogin,
  useGetUserByHash,
};
