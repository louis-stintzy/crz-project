import type { ClosetEntity } from "../types/closetEntity.types";
import { axiosInstance } from "./axiosInstance";

const getAll = async (): Promise<ClosetEntity[]> => {
  const response = await axiosInstance.get<ClosetEntity[]>("/closets");
  return response.data;
};

export const closetService = {
  getAll,
};
