import { useState, useEffect } from "react";
import { Button, ProgressSpinner, InputText, Dropdown, Calendar } from "../../ui";
import dayjs from "dayjs";
import { ExpenseService } from "../../services/api/expenseService";
import { Expense } from "../../models/expense";

function ExpenseForm({ getExpenses, getRecurringExpenses, onClose, showToast, selectedExpense, isRecurring }) {
    const expenseService = new ExpenseService();
    const preferredCurrency = localStorage.getItem("preferred_currency") || "USD";

    const [loading, setLoading] = useState(false);

    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [currency, setCurrency] = useState(preferredCurrency);
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(dayjs());

    const [errors, setErrors] = useState({
        description: "",
        category: "",
        amount: "",
    });

    useEffect(() => {
        if (selectedExpense) {
            setDescription(selectedExpense.description);
            setCategory(selectedExpense.category_name);
            setCurrency(selectedExpense.currency);
            setAmount(selectedExpense.amount);
            setDate(dayjs(selectedExpense.date));
        }
        else {
            resetForm();
        }
    }, [selectedExpense]);

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);
        setErrors({ ...errors, description: value.length > 50 ? "Max 50 characters allowed" : "" });
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategory(value);
        setErrors({ ...errors, category: value.length > 20 ? "Max 20 characters allowed" : "" });
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,8}(\.\d{0,2})?$/.test(value) || value === "") {
            setAmount(value);
            setErrors({ ...errors, amount: "" });
        } else {
            setErrors({ ...errors, amount: "Max 8 digits and 2 decimals allowed" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (errors.description || errors.category || errors.amount) {
            showToast("Please fix the errors before submitting.", "error");
            return;
        }

        const data = new Expense(-1, -1, description, category, amount, currency, date.format("YYYY-MM-DD"), isRecurring);

        if (selectedExpense) {
            updateExpense(selectedExpense.id, data);
        } else {
            createExpense(data);
        }
        resetForm();
    };

    const createExpense = (data) => {
        setLoading(true);
        expenseService.create(data)
            .then((response) => {
                if (response.status === 201) {
                    showToast("Expense created!", "success");
                    getExpenses();
                    getRecurringExpenses();
                    onClose();
                }
                else {
                    showToast("Failed to create Expense.", "error");
                }
            })
            .catch((error) => {
                showToast(error.message || "Something went wrong!", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const updateExpense = (id, data) => {
        setLoading(true);
        expenseService.update(id, data)
            .then((response) => {
                if (response.status === 200) {
                    showToast("Expense updated!", "success");
                    getExpenses();
                    getRecurringExpenses();
                    onClose();
                }
                else {
                    showToast("Failed to update Expense.", "error");
                }
            })
            .catch((error) => {
                showToast(error.message || "Something went wrong!", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const resetForm = () => {
        setDescription("");
        setCategory("");
        setCurrency(preferredCurrency);
        setAmount("");
        setDate(dayjs());
        setErrors({
            description: "",
            category: "",
            amount: "",
        });
    };

    return (
        <div>
            {
                loading ? (
                    <div className="flex justify-content-center align-items-center h-6 w-6 m-auto ">
                        <ProgressSpinner strokeWidth="4" />
                    </div>
                ) : (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label htmlFor="description">Description</label>
                                <InputText
                                    id="description"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    className={`w-full ${errors.description ? 'p-invalid' : ''}`}
                                    required
                                />
                                {errors.description && <small className="p-error">{errors.description}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="category">Category</label>
                                <InputText
                                    id="category"
                                    value={category}
                                    onChange={handleCategoryChange}
                                    className={`w-full ${errors.category ? 'p-invalid' : ''}`}
                                    required
                                />
                                {errors.category && <small className="p-error">{errors.category}</small>}
                            </div>
                            <div className="grid align-center">
                                <div className="col-8">
                                    <div className="field">
                                        <label htmlFor="amount">Amount</label>
                                        <InputText
                                            id="amount"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            className={`w-full ${errors.amount ? 'p-invalid' : ''}`}
                                            required
                                        />
                                        {errors.amount && <small className="p-error">{errors.amount}</small>}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="field">
                                        <label htmlFor="currency">Currency</label>
                                        <Dropdown
                                            id="currency"
                                            value={currency}
                                            options={["USD", "EUR", "GBP", "JPY", "PEN", "ARS", "CLP"]}
                                            onChange={(e) => setCurrency(e.value)}
                                            className="w-full"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {
                                !isRecurring && (
                                    <div className="field">
                                        <label htmlFor="date">Date</label>
                                        <Calendar
                                            id="date"
                                            value={date.toDate()}
                                            onChange={(e) => setDate(dayjs(e.value))}
                                            dateFormat="yy-mm-dd"
                                            className="w-full"
                                            required
                                        />
                                    </div>
                                )
                            }
                            <div className="flex justify-content-end mt-6">
                                <Button text severity="danger" type="button" label="Cancel" onClick={onClose} />
                                <Button type="submit" label={selectedExpense ? "Update Expense" : "Add Expense"} icon="pi pi-plus" />
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    );
}

export default ExpenseForm;