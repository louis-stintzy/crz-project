import axios from "axios";

const apiUrl: string =
  (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3000/api/v1";

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});
