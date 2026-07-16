import type { AppUserPublic } from "../types/appUser.types";
import type { LoginInput, RegisterInput } from "../types/auth.types";
import { axiosInstance } from "./axiosInstance";

const register = async (data: RegisterInput): Promise<AppUserPublic> => {
  const response = await axiosInstance.post<AppUserPublic>(
    "/auth/register",
    data,
  );
  return response.data;
};

const login = async (data: LoginInput): Promise<AppUserPublic> => {
  const response = await axiosInstance.post<AppUserPublic>("/auth/login", data);
  return response.data;
};

const logout = async (): Promise<void> => {
  await axiosInstance.post<void>("/auth/logout");
};

export const authService = {
  register,
  login,
  logout,
};
