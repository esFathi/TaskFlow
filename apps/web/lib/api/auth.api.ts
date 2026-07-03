// Auth API requests.

import { api } from "./client";

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types";

export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data;
}
