import type { AppUserPublic } from "../types/appUser.types";
import type { LoginInput } from "../types/auth.types";
import { axiosInstance } from "./axiosInstance";

const login = async (data: LoginInput): Promise<AppUserPublic> => {
  const response = await axiosInstance.post<AppUserPublic>("/auth/login", data);
  return response.data;
};

const logout = async (): Promise<void> => {
  await axiosInstance.post<void>("/auth/logout");
};

export const authService = {
  login,
  logout,
};
