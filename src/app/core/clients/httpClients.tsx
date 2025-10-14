import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { apiUrl } from "../variables";

const BASEURL = apiUrl;

const httpClient = axios.create({
    baseURL: BASEURL,
});

// httpClient.interceptors.request.use(
//     async (config: InternalAxiosRequestConfig) => {
//         const parsedPersistedAuth = JSON.parse(
//             localStorage.getItem("persist:auth") || "{}"
//         );
//         // console.log(parsedPersistedAuth);
//         // const token = JSON.parse(parsedPersistedAuth?.login)?.data?.access_token;
//         const token = localStorage.getItem("token");

//         config.headers.Authorization = token ? `Bearer ${token}` : "";

//         config.signal = new AbortController().signal;

//         return config;
//     }
// );

httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Get token directly from AuthProvider storage
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.signal = new AbortController().signal;

        return config;
    }
);

httpClient.interceptors.response.use(
    (response: AxiosResponse<unknown>) => {
        return response;
    },
    (error) => {
        throw error;
    }
);

export default httpClient;