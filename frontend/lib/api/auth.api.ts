import { LoginCredentials, RegisterCredentials } from "@/types/user.types";
import { apiClient } from "./axios";

export const authApi = {
  register: (data: RegisterCredentials) => apiClient.post("/api/auth/register", data),
  login: (data: LoginCredentials) => apiClient.post("/api/auth/login", data),
  logout: () => apiClient.post("/api/auth/logout"),
};
