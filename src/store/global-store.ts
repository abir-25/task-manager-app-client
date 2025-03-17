import { UserInfo } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { LoginApiResponse } from "../types/api-response.types";

interface GlobalStore {
  userInfo: UserInfo | null;
  hydrateStore: (data: LoginApiResponse) => void;
  clearStore: () => void;
  updateUserInfo: (updatedData: Partial<UserInfo>) => void;
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
}

export const useGlobalStore = create<GlobalStore>()(
  devtools(
    persist(
      (set) => ({
        userInfo: null,
        hydrateStore: (data) =>
          set({
            userInfo: data.userInfo,
          }),
        clearStore: () =>
          set({
            userInfo: null,
          }),
        updateUserInfo: (updatedData) =>
          set((state) => ({
            userInfo: state.userInfo
              ? {
                  ...state.userInfo,
                  ...updatedData,
                  jwToken: state.userInfo.jwToken,
                }
              : (updatedData as UserInfo),
          })),
        isSidebarExpanded: true,
        toggleSidebar: () =>
          set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
      }),
      {
        name: "task-manager-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
