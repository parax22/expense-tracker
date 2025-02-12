import { useState, useEffect } from "react";
import { Button, DataTable, Column, Dialog, ProgressSpinner } from "../ui";
import api from "../api";
import SnackbarAlert from "../components/SnackbarAlert";
import ExpenseForm from "../components/ExpenseForm";

function Expenses() {
    useEffect(() => {
        getExpenses();
    }, []);

    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const createAlert = (message, severity) => {
        setAlertMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
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
                } else {
                    createAlert("Failed to delete Expense.", "error");
                }
                getExpenses();
            })
            .catch((error) => {
                createAlert(error.message || "Something went wrong!", "error");
            });
    };

    const actionsBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    text
                    severity="info"
                    icon="pi pi-pencil"
                    onClick={() => editExpense(rowData.id)}
                />
                <Button
                    text
                    severity="danger"
                    icon="pi pi-trash"
                    onClick={() => deleteExpense(rowData.id)}
                />
            </>
        );
    };

    return (
        <>
            <div className="p-4 shadow-2 border-round surface-card">
                <div className="flex justify-content-between align-items-center">
                    <h2>Expenses</h2>
                    <Button text label="Add Expense" icon="pi pi-plus" onClick={() => setOpen(true)} />
                </div>
                {
                    loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ProgressSpinner strokeWidth="4" />
                        </div>
                    ) :
                        <DataTable 
                            value={expenses} 
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 15, 20, 25]}
                            totalRecords={expenses.length}
                            emptyMessage="No expenses found."
                        >
                            <Column field="id" header="ID" />
                            <Column field="description" header="Description" sortable />
                            <Column field="category_name" header="Category" sortable />
                            <Column field="amount" header="Amount" sortable />
                            <Column field="currency" header="Currency" sortable />
                            <Column field="date" header="Date" sortable />
                            <Column body={actionsBodyTemplate} header="Actions" />
                        </DataTable>
                }
            </div>

            <Dialog
                visible={open}
                onHide={() => {
                    setOpen(false);
                    setSelectedExpense(null);
                }}
                closable={false}
                header= { selectedExpense ? "Edit Expense" : "Add Expense" }
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

export default Expenses;