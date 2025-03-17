import { UpdateUserProfileFormType } from "@/pages/User/components/UserProfileForm/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userService } from "../user.service";

export const GET_USER_INFO = "GET_USER_INFO";

const useUserInfo = () => {
  return useQuery({
    queryKey: [GET_USER_INFO],
    queryFn: () => userService.getUserInfo(),
  });
};

const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: (formData: UpdateUserProfileFormType) =>
      userService.updateUserInfo(formData),
  });
};

export const userQueryService = {
  useUserInfo,
  useUpdateUserProfile,
};
