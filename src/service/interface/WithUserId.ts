import { useGlobalStore } from "@/store/global-store";

export abstract class WithUserID {
  protected get userID() {
    const { userInfo } = useGlobalStore.getState();
    return userInfo ? userInfo.id : null;
  }
}
