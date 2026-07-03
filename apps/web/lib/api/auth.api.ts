// Auth API requests.

import { apiClient } from "./client";

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types";

export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post("/auth/register", data);

  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/login", data);

  return response.data;
};
