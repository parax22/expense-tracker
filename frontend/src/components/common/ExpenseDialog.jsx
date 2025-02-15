import { Dialog } from "../../ui";
import ExpenseForm from "./ExpenseForm";

const ExpenseDialog = ({ visible, onHide, selectedExpense, getExpenses, getRecurringExpenses, showToast }) => {
    return (
        <Dialog visible={visible} onHide={onHide} closable={false} header={selectedExpense ? "Edit Expense" : "Add Expense"}>
            <ExpenseForm
                getExpenses={getExpenses}
                getRecurringExpenses={getRecurringExpenses}
                onClose={onHide}
                showToast={showToast}
                selectedExpense={selectedExpense}
            />
        </Dialog>
    );
};

export default ExpenseDialog;
