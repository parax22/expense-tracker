import { BaseService } from './baseService';
import { PREF_CURRENCY } from '../../constants';

export class SettingService extends BaseService {
    constructor() {
        super("api/settings");
    }

    getAll() {
        return this.http.get(this.endpointPath())
            .then((response) => response.data)
            .then((data) => data[0])
            .then((data) => {
                localStorage.setItem(PREF_CURRENCY, data.preferred_currency);
                return data;
            });
    }

    update(data) {
        console.log(data);
        localStorage.setItem(PREF_CURRENCY, data.preferred_currency);
        return this.http.put(`${this.endpointPath()}update/`, data);
    }
}