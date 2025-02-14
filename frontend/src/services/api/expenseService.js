import { BaseService } from "./baseService";

export class ExpenseService extends BaseService {
    constructor() {
        super("api/expenses");
    }

    update(id, data) {
        return this.http.put(`${this.endpointPath()}update/${id}/`, data);
    }

    getAllRecurring() {
        return this.http.get(`${this.endpointPath()}recurring/`);
    }
}