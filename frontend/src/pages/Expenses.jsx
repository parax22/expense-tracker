import { useState, useEffect } from "react";
import { Button, DataTable, Column, Dialog, ProgressSpinner, Toast } from "../ui";
import ExpenseForm from "../components/common/ExpenseForm";
import { ExpenseService } from "../services/api/expenseService";
import { useToast } from "../hooks/useToast";

function Expenses() {
    const expenseService = new ExpenseService();

    useEffect(() => {
        getExpenses();
    }, []);

    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const { showToast, toastRef } = useToast();

    const getExpenses = () => {
        setLoading(true);
        expenseService.getAll()
            .then((response) => response.data)
            .then((data) => {
                setExpenses(data);
            })
            .catch((error) => {
                showToast(error.message || "Failed to fetch Expenses.", "error");
            })
            .finally(() => setLoading(false));
    };

    const editExpense = (id) => {
        const expense = expenses.find((expense) => expense.id === id);
        setSelectedExpense(expense);
        setOpen(true);
    };

    const deleteExpense = (id) => {
        expenseService.delete(id)
            .then(() => {
                showToast("Expense deleted!", "success");
                getExpenses();
            })
            .catch((error) => {
                showToast(error.message || "Failed to delete Expense.", "error");
            })
    };

    const exportToCSV = () => {
        const csvContent = [
            ["ID", "Description", "Category", "Amount", "Currency", "Date"],
            ...expenses.map(expense => [
                expense.id,
                expense.description,
                expense.category_name,
                expense.amount,
                expense.currency,
                expense.date
            ])
        ]
            .map(e => e.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "expenses.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
                    <div>
                        <Button text label="Add Expense" icon="pi pi-plus" onClick={() => setOpen(true)} />
                        <Button label="Export" icon="pi pi-download" onClick={() => exportToCSV()} />
                    </div>
                </div>
                {
                    loading ? (
                        <div className="flex justify-content-center align-items-center">
                            <ProgressSpinner strokeWidth="4" />
                        </div>
                    ) :
                        <DataTable
                            value={expenses}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[10, 15, 20, 25, 50]}
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
                header={selectedExpense ? "Edit Expense" : "Add Expense"}
            >
                <ExpenseForm
                    getExpenses={getExpenses}
                    onClose={() => { setOpen(false); setSelectedExpense(null); }}
                    showToast={showToast}
                    selectedExpense={selectedExpense}
                />
            </Dialog>

            <Toast ref={toastRef} position="bottom-right" />
        </>
    );
}

export default Expenses;