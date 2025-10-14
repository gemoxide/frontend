import httpClient from "../../clients/httpClients";

export const login = async (email: string, password: string) => {
    return httpClient.post("/api/v1/auth/login", { email, password });
};