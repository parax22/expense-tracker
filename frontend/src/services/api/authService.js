import { BaseService } from "./baseService";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { jwtDecode } from "jwt-decode";

export class AuthService extends BaseService {
    constructor() {
        super("api");
    }

    login(data) {
        return this.http.post(`${this.endpointPath()}token/`, data)
            .then((response) => {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                this.setToken();
                return response;
            });

    }

    register(data) {
        return this.http.post(`${this.endpointPath()}user/register/`, data);
    }

    async isAuthenticated() {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) return false;

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const currentTime = Date.now() / 1000;

        if (tokenExpiration < currentTime) {
            return this.refreshAuthToken();
        }
        return true;
    }

    refreshAuthToken() {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) return false;

        return this.http.post(`${this.endpointPath()}token/refresh/`, { refresh: refreshToken })
            .then(response => {
                if (response.status === 200) {
                    localStorage.setItem(ACCESS_TOKEN, response.data.access);
                    this.setToken();
                    return true;
                }
                return false;
            })
            .catch(error => {
                console.error("Error refreshing token:", error);
                return false;
            });
    }
}