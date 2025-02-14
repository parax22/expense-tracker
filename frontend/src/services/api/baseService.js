import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";


export class BaseService {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.baseURL = import.meta.env.VITE_API_URL;
        this.token = localStorage.getItem(ACCESS_TOKEN);
        this.refreshToken = localStorage.getItem(REFRESH_TOKEN);

        this.http = axios.create({
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token ? `Bearer ${this.token}` : "",
            },
        });

        this.http.interceptors.request.use(
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
        this.http.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                          if (!refreshToken) {
                            throw new Error("No refresh token available");
                        }

                        const response = await axios.post(
                            `${this.baseURL}/api/token/refresh/`,
                            { refresh: refreshToken }
                        );

                        if (response.status === 200) {
                            localStorage.setItem(ACCESS_TOKEN, response.data.access);
                            this.http.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
                            originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
                            return this.http(originalRequest);
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
    }

    setToken() {
        this.token = localStorage.getItem(ACCESS_TOKEN);
        this.http = axios.create({
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token ? `Bearer ${this.token}` : "",
            },
        });
    }

    endpointPath() {
        return `${this.baseURL}/${this.endpoint}/`;
    }

    getAll(){
        return this.http.get(this.endpointPath());
    }

    create(data){
        return this.http.post(this.endpointPath(), data);
    }

    delete(id) {
        return this.http.delete(`${this.endpointPath}${id}`);
    }
}

export default BaseService;