import { useState, useEffect } from "react";
import LastExpense from "../components/dashboard/LastExpense";
import ExpenseForm from "../components/common/ExpenseForm";
import RecurringExpenses from "../components/dashboard/RecurringExpenses";
import ExpenseAnalytics from "../components/dashboard/ExpenseAnalytics";
import { Dialog, Toast } from "../ui";
import { useToast } from "../hooks/useToast";
import dayjs from "dayjs";
import { ExpenseService } from "../services/api/expenseService";
import { Expense as ExpenseModel } from "../models/expense";


function Dashboard() {
    const expenseService = new ExpenseService();

    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    const [recurring, setRecurring] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const { showToast, toastRef } = useToast();

    useEffect(() => {
        getExpenses();
        getRecurringExpenses();
    }, []);

    const getExpenses = () => {
        setLoading(true);
        expenseService.getAll()
            .then((response) => response.data)
            .then((data) => {
                setExpenses(data);
            })
            .catch((error) => {
                showToast(error.message || "Something went wrong!", "error");
            })
            .finally(() => setLoading(false));
    };

    const getRecurringExpenses = () => {
        setLoading(true);
        expenseService.getAllRecurring()
            .then((response) => response.data)
            .then((data) => {
                setRecurringExpenses(data);
            })
            .catch((error) => {
                showToast(error.message || "Something went wrong!", "error");
            })
            .finally(() => setLoading(false));
    };

    const createExpense = (id) => {
        const expense = recurringExpenses.find((expense) => expense.id === id);
        const data = new ExpenseModel(-1, -1, expense.description, expense.category_name, expense.amount, expense.currency, dayjs().format("YYYY-MM-DD"), false);

        expenseService.create(data)
            .then((response) => {
                if (response.status === 201) {
                    showToast("Expense created!", "success");
                    getExpenses();
                    getRecurringExpenses();
                    setOpen(false);
                }
                else {
                    showToast("Failed to create Expense.", "error");
                }
            })
            .catch((err) => {
                showToast(err.message || "Something went wrong!", "error");
            });
    };

    const editExpense = (id, isRecurring) => {
        const expense = isRecurring ? recurringExpenses.find((expense) => expense.id === id) : expenses.find((expense) => expense.id === id);
        isRecurring ? setRecurring(true) : setRecurring(false);
        setSelectedExpense(expense);
        setOpen(true);
    };

    const deleteExpense = (id) => {
        expenseService.delete(id)
            .then((response) => {
                if (response.status === 204) {
                    showToast("Expense deleted!", "success");
                }
                else {
                    showToast("Failed to delete Expense.", "error");
                }
                getExpenses();
                getRecurringExpenses();
            })
            .catch((error) => {
                showToast(error.message || "Something went wrong!", "error");
            });
    };

    return (
        <>
            <div className="grid">
                <div className="col-12 lg:col-4">
                    <LastExpense
                        expense={expenses[expenses.length - 1]}
                        onDelete={deleteExpense}
                        onEdit={editExpense}
                        onCreate={() => {
                            setRecurring(false);
                            setSelectedExpense(null);
                            setOpen(true);
                        }}
                        loading={loading}
                    />
                </div>
                <div className="col-12 lg:col-8">
                    <RecurringExpenses
                        expenses={recurringExpenses}
                        onDelete={deleteExpense}
                        onEdit={editExpense}
                        onCreate={createExpense}
                        loading={loading}
                    />
                </div>
                <div className="col-12">
                    <ExpenseAnalytics />
                </div>
            </div>

            <Dialog
                visible={open}
                onHide={() => {
                    setOpen(false);
                    setSelectedExpense(null);
                }}
                closable={false}
                header={selectedExpense ?
                    (recurring ? "Edit Recurring Expense" : "Edit Expense") :
                    (recurring ? "New Recurring Expense" : "New Expense")
                }
            >
                <ExpenseForm
                    getExpenses={getExpenses}
                    getRecurringExpenses={getRecurringExpenses}
                    onClose={() => { setOpen(false); setSelectedExpense(null); setRecurring(false); }}
                    showToast={showToast}
                    selectedExpense={selectedExpense}
                    isRecurring={recurring}
                />
            </Dialog>

            <Toast ref={toastRef} position="bottom-right" />
        </>
    );
}

export default Dashboard;