import type {
  ClosetEntity,
  CreateClosetInput,
  UpdateClosetInput,
} from "../types/closetEntity.types";
import { axiosInstance } from "./axiosInstance";

const getAll = async (): Promise<ClosetEntity[]> => {
  const response = await axiosInstance.get<ClosetEntity[]>("/closets");
  return response.data;
};

const create = async (data: CreateClosetInput): Promise<ClosetEntity> => {
  const response = await axiosInstance.post<ClosetEntity>("/closets", data);
  return response.data;
};

const updateById = async (
  id: string,
  data: UpdateClosetInput,
): Promise<ClosetEntity> => {
  const response = await axiosInstance.patch<ClosetEntity>(
    `/closets/${id}`,
    data,
  );
  return response.data;
};

export const closetService = {
  getAll,
  create,
  updateById,
};
