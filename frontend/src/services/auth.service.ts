import type { AppUserPublic } from "../types/appUser.types";
import type { LoginInput } from "../types/auth.types";
import { axiosInstance } from "./axiosInstance";

const login = async (data: LoginInput): Promise<AppUserPublic> => {
  const response = await axiosInstance.post<AppUserPublic>("/auth/login", data);
  return response.data;
};

export const authService = {
  login,
};
