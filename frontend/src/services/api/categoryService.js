import { BaseService } from "./baseService";

export class CategoryService extends BaseService {
    constructor() {
        super("api/categories");
    }
}