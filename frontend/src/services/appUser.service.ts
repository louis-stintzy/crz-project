import type { AppUserPublic, UpdateAppUserInput } from "../types/appUser.types";
import { axiosInstance } from "./axiosInstance";

const getMe = async (): Promise<AppUserPublic> => {
  const response = await axiosInstance.get<AppUserPublic>("/users/me");
  return response.data;
};

const updateMe = async (data: UpdateAppUserInput): Promise<AppUserPublic> => {
  const response = await axiosInstance.patch<AppUserPublic>("/users/me", data);
  return response.data;
};

export const appUserService = {
  getMe,
  updateMe,
};
