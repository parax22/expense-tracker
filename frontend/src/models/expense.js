export class Expense {
    constructor(id, category, description, category_name, amount, currency, date, is_recurring) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.category_name = category_name;
        this.amount = amount;
        this.currency = currency;
        this.date = date;
        this.is_recurring = is_recurring;
    }
}