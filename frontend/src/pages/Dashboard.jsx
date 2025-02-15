import { useState, useEffect } from "react";
import LastExpense from "../components/dashboard/LastExpense";
import ExpenseForm from "../components/common/ExpenseForm";
import RecurringExpenses from "../components/dashboard/RecurringExpenses";
import ExpenseAnalytics from "../components/dashboard/ExpenseAnalytics";
import { Dialog, Toast } from "../ui";
import { useToast } from "../hooks/useToast";
import { useExpense } from "../hooks/useExpense";

function Dashboard() {
    const { expenses, recurringExpenses, loading, getExpenses, getRecurringExpenses, createExpense, deleteExpense } = useExpense();

    const [open, setOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [recurring, setRecurring] = useState(false);
    const { showToast, toastRef } = useToast();

    useEffect(() => {
        getExpenses();
        getRecurringExpenses();
    }, [getExpenses, getRecurringExpenses]);

    const handleCreateExpense = (id) => {
        const expense = recurringExpenses.find((expense) => expense.id === id);
        const data = new ExpenseModel(-1, -1, expense.description, expense.category_name, expense.amount, expense.currency, dayjs().format("YYYY-MM-DD"), false);

        if (createExpense(data)) {
            showToast("Expense created!", "success");
            setOpen(false);
        } else {
            showToast("Failed to create Expense.", "error");
        }
    };

    const handleEditExpense = (id, isRecurring) => {
        const expense = isRecurring ? recurringExpenses.find((expense) => expense.id === id) : expenses.find((expense) => expense.id === id);
        isRecurring ? setRecurring(true) : setRecurring(false);
        setSelectedExpense(expense);
        setOpen(true);
    };

    const handleDeleteExpense = (id) => {
        if (deleteExpense(id)) {
            showToast("Expense deleted!", "success");
        } else {
            showToast("Failed to delete Expense.", "error");
        }
    };

    return (
        <>
            <div className="grid">
                <div className="col-12 lg:col-4">
                    <LastExpense
                        expense={expenses[expenses.length - 1]}
                        onDelete={handleDeleteExpense}
                        onEdit={handleEditExpense}
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
                        onDelete={handleDeleteExpense}
                        onEdit={handleEditExpense}
                        onCreate={handleCreateExpense}
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