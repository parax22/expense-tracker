import { useState, useEffect } from "react";
import api from "../api";
import Expense from "../components/Expense";
import { Button, Card, Dialog, ProgressSpinner } from "../ui";
import SnackbarAlert from "../components/SnackbarAlert";
import ExpenseForm from "../components/ExpenseForm";

function Dashboard() {
    const preferredCurrency = localStorage.getItem("preferredCurrency") || "USD";

    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const createAlert = (message, severity) => {
        setAlertMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };

    useEffect(() => {
        getExpenses();
        getRecurringExpenses();
    }, []);

    const getExpenses = () => {
        setLoading(true);
        api.get("/api/expenses/")
            .then((res) => res.data)
            .then((data) => {
                setExpenses(data);
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            })
            .finally(() => setLoading(false));
    };

    const getRecurringExpenses = () => {
        setLoading(true);
        api.get("/api/expenses/recurring/")
            .then((res) => res.data)
            .then((data) => {
                setRecurringExpenses(data);
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            })
            .finally(() => setLoading(false));
    };

    const editExpense = (id) => {
        const expense = expenses.find((expense) => expense.id === id);
        setSelectedExpense(expense);
        setOpen(true);
    };

    const deleteExpense = (id) => {
        api
            .delete(`/api/expenses/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    createAlert("Expense deleted!", "success");
                }
                else {
                    createAlert("Failed to delete Expense.", "error");
                }
                getExpenses();
            })
            .catch((error) => {
                createAlert(error.message || "Something went wrong!", "error");
            });
    };

    return (
        <>
            <div className="grid">
                <div className="col-12 lg:col-4">
                    <div className="p-4 shadow-2 border-round">
                        <div className="flex flex-wrap justify-content-between align-items-center">
                            <h2>Latest Expense</h2>
                            <Button
                                text
                                label="Create New Expense"
                                icon="pi pi-plus"
                                onClick={() => {
                                    setOpen(true);
                                    setSelectedExpense(null);
                                }}
                                style={{ marginTop: '1rem' }}
                            />
                        </div>
                        {
                            loading ?
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <ProgressSpinner strokeWidth="3" />
                                </div> :
                                expenses.length > 0 ? (
                                    <Expense expense={expenses[expenses.length - 1]} onDelete={deleteExpense} onEdit={editExpense} />
                                ) : (
                                    <p>No expenses found.</p>
                                )
                        }
                    </div>
                </div>
                <div className="col-12 lg:col-8">
                    <div className="p-4 shadow-2 border-round">
                        <div className="flex flex-wrap justify-content-between align-items-center">
                            <h2>Recurring Expenses</h2>
                            <Button
                            text
                            label="Create New Recurring Expense"
                            icon="pi pi-plus"
                            onClick={() => {
                                setOpen(true);
                                setSelectedExpense(null);
                            }}
                            style={{ marginTop: '1rem' }}
                        />
                        </div>
                        {
                            loading ?
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <ProgressSpinner strokeWidth="3" />
                                </div> :
                                recurringExpenses.length > 0 ? (
                                    recurringExpenses.map((expense) => (
                                        <Expense key={expense.id} expense={expense} onDelete={deleteExpense} onEdit={editExpense} />
                                    ))
                                ) : (
                                    <p>No recurring expenses found.</p>
                                )
                        }
                    </div>
                </div>
            </div>

            <Dialog
                visible={open}
                onHide={() => {
                    setOpen(false);
                    setSelectedExpense(null);
                }}
                closable={false}
                header={selectedExpense ? "Edit Expense" : "Add Expense"}
            >
                <ExpenseForm
                    getExpenses={getExpenses}
                    onClose={() => { setOpen(false); setSelectedExpense(null); }}
                    createAlert={createAlert}
                    selectedExpense={selectedExpense}
                />
            </Dialog>

            <SnackbarAlert
                open={openSnackbar}
                severity={severity}
                message={alertMessage}
                onClose={() => setOpenSnackbar(false)}
            />
        </>
    );
}

export default Dashboard;