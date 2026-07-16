import type { AppUserPublic } from "../types/appUser.types";
import { axiosInstance } from "./axiosInstance";

const getMe = async (): Promise<AppUserPublic> => {
  const response = await axiosInstance.get<AppUserPublic>("/users/me");
  return response.data;
};

export const appUserService = {
  getMe,
};
