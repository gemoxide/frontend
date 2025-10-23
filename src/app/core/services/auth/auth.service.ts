import type { AxiosResponse } from "axios";
import type { LoginPayload } from "../../state/types/auth";
import httpClient from "../../clients/httpClients";

export const loginRequest = (payload: LoginPayload): Promise<AxiosResponse> => {
  return httpClient.post(`/api/v1/auth/login`, payload);
};

export const getLoggedInUserRequest = (): Promise<AxiosResponse> => {
  return httpClient.get(`/api/v1/auth/user`);
};
