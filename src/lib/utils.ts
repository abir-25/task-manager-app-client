import { useGlobalStore } from "@/store/global-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_THEME_COLOR, setThemeColor } from "./theme";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isTokenValid = (token: string) => {
  const [, actualToken] = token.split(".");

  if (!actualToken) {
    throw new Error("Invalid token");
  }

  const parsedToken = JSON.parse(window.atob(actualToken)) as { exp?: number };

  if (!parsedToken.exp) {
    return false;
  }

  const now = (new Date().getTime() + 10_000) / 1000;

  return parsedToken.exp > now;
};

export const getJWTToken = async (): Promise<string | null> => {
  const jwtToken = useGlobalStore.getState()?.userInfo?.jwToken;
  const clearStore = useGlobalStore.getState().clearStore;

  if (!jwtToken) {
    clearStore();
    setThemeColor(DEFAULT_THEME_COLOR);
    return null;
  }

  const isJwtTokenValid = isTokenValid(jwtToken);

  if (isJwtTokenValid) {
    return jwtToken;
  }

  clearStore();
  setThemeColor(DEFAULT_THEME_COLOR);
  return null;
};
