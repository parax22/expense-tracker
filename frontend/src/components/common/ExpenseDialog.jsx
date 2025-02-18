import { Dialog } from "../../ui";
import ExpenseForm from "./ExpenseForm";

const ExpenseDialog = ({ visible, onHide, selectedExpense, isRecurring, getExpenses, getRecurringExpenses, showToast }) => {
    return (
        <Dialog visible={visible} onHide={onHide} closable={false}
            header={
                selectedExpense ? 
                    (isRecurring ? "Edit Recurring Expense" : "Edit Expense") : 
                    (isRecurring ? "Add Recurring Expense" : "Add Expense")
            }
        >
            <ExpenseForm
                getExpenses={getExpenses}
                getRecurringExpenses={getRecurringExpenses}
                onClose={onHide}
                showToast={showToast}
                selectedExpense={selectedExpense}
                isRecurring={isRecurring}
            />
        </Dialog>
    );
};

export default ExpenseDialog;
