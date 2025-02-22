import { useState, useEffect } from "react";
import { Button, DataTable, Column, ProgressSpinner, Toast } from "../ui";
import ExpenseDialog from "../components/common/ExpenseDialog";
import { useToast } from "../hooks/useToast";
import { useExpense } from "../hooks/useExpense";
import { useDialog } from "../hooks/useDialog";

function Expenses() {
    const { expenses, loading, getExpenses, getRecurringExpenses, deleteExpense: deleteExpenseHook } = useExpense();
    const { open, selectedItem: selectedExpense, openDialog, closeDialog } = useDialog();
    const { showToast, toastRef } = useToast();

    useEffect(() => {
        getExpenses();
    }, []);

    const editExpense = (id) => {
        const expense = expenses.find((expense) => expense.id === id);
        openDialog(expense);
    };

    const deleteExpense = async (id) => {
        if (await deleteExpenseHook(id)) {
            showToast("Expense deleted!", "success");
        } else {
            showToast("Failed to delete Expense.", "error");
        }
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
                <div className="flex flex-wrap justify-content-between align-items-center">
                    <h2>Expenses</h2>
                    <div className="flex gap-2">
                        <Button text label="Add Expense" icon="pi pi-plus" onClick={() => openDialog()} />
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
                            rowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
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

            <ExpenseDialog
                visible={open}
                onHide={closeDialog}
                selectedExpense={selectedExpense}
                getExpenses={getExpenses}
                getRecurringExpenses={getRecurringExpenses}
                showToast={showToast}
            />

            <Toast ref={toastRef} position="bottom-right" />
        </>
    );
}

export default Expenses;