import { useState, useEffect } from "react";
import api from "../api";
import Expense from "../components/Expense";
import { Button, Dialog, ProgressSpinner, Carousel } from "../ui";
import SnackbarAlert from "../components/SnackbarAlert";
import ExpenseForm from "../components/ExpenseForm";
import dayjs from "dayjs";
function Dashboard() {
    const preferredCurrency = localStorage.getItem("preferredCurrency") || "USD";

    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    const [recurring, setRecurring] = useState(false);
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

    const getAnalytics = () => {
        api.get("/api/analytics/")
            .then((res) => res.data)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            });
    };

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

    const createExpense = (id) => {
        const expense = recurringExpenses.find((expense) => expense.id === id);
        const data = {
            description: expense.description,
            category_name: expense.category_name,
            currency: expense.currency,
            amount: expense.amount,
            date: dayjs().format("YYYY-MM-DD"),
            is_recurring: false
        };

        api.post("/api/expenses/", data)
            .then((res) => {
                if (res.status === 201) {
                    createAlert("Expense created successfully.", "success");
                    getExpenses();
                    getRecurringExpenses();
                    setOpen(false);
                }
                else {
                    createAlert("Failed to create Expense.", "error");
                }
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            });
    };

    const editExpense = (id, isRecurring) => {
        const expense = isRecurring ? recurringExpenses.find((expense) => expense.id === id) : expenses.find((expense) => expense.id === id);
        isRecurring ? setRecurring(true) : setRecurring(false);
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
                getRecurringExpenses();
            })
            .catch((error) => {
                createAlert(error.message || "Something went wrong!", "error");
            });
    };

    return (
        <>
            <div className="grid">
                <div className="col-12 lg:col-4">
                    <div className="p-4 shadow-2 border-round h-full">
                        <div className="flex flex-wrap justify-content-between align-items-center">
                            <h2>Latest Expense</h2>
                            <Button
                                text
                                label="Add Expense"
                                icon="pi pi-plus"
                                onClick={() => {
                                    setRecurring(false);
                                    setSelectedExpense(null);
                                    setOpen(true);
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
                                    <Expense expense={expenses[expenses.length - 1]} isRecurring={false} onDelete={deleteExpense} onEdit={editExpense} onCreate={createExpense} />
                                ) : (
                                    <p>No expenses found.</p>
                                )
                        }
                    </div>
                </div>
                <div className="col-12 lg:col-8">
                    <div className="p-4 shadow-2 border-round h-full">
                        <div className="flex flex-wrap justify-content-between align-items-center">
                            <h2>Recurring Expenses</h2>
                            <Button
                            text
                            label="Add Recurring Expense"
                            icon="pi pi-plus"
                            onClick={() => {
                                setRecurring(true);
                                setSelectedExpense(null);
                                setOpen(true);
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
                                    <Carousel 
                                        className="w-full h-full"
                                        value={recurringExpenses} 
                                        numVisible={3} numScroll={1}
                                        responsiveOptions={[{ breakpoint: '1440px', numVisible: 2, numScroll: 1 }, { breakpoint: '1024px', numVisible: 1, numScroll: 1 }]}
                                        circular
                                        itemTemplate={(expense) => (
                                            <Expense expense={expense} isRecurring={true} onDelete={deleteExpense} onEdit={editExpense} onCreate={createExpense} />
                                        )}
                                    />
                                ) : (
                                    <p>No recurring expenses found.</p>
                                )
                        }
                    </div>
                </div>
                <Button text label="Get Analytics" onClick={getAnalytics} />
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
                    createAlert={createAlert}
                    selectedExpense={selectedExpense}
                    isRecurring={recurring}
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