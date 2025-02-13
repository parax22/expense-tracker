import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Solution to Error 401: Unauthorized (Token expired)

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }
                
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
                    { refresh: refreshToken }
                );
                
                if (response.status === 200) {
                    localStorage.setItem(ACCESS_TOKEN, response.data.access);
                    api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
                    originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token failed", refreshError);
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                window.location.href = "/logout";
            }
        }
        return Promise.reject(error);
    }
);

export default api;