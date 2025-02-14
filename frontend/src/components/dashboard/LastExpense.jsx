import Expense from "../common/Expense";
import { Button, ProgressSpinner } from "../../ui";

function LastExpense({ expense, onDelete, onEdit, onCreate, loading }) {
    return (
        <div className="p-4 border-round h-full">
            <div className="flex flex-wrap justify-content-around align-items-center">
                <h2>Latest Expense</h2>
                <Button
                    text
                    label="Add Expense"
                    icon="pi pi-plus"
                    onClick={onCreate}
                    style={{ marginTop: '1rem' }}
                />
            </div>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ProgressSpinner strokeWidth="3" />
                </div>
            ) : expense ? (
                <Expense expense={expense} isRecurring={false} onDelete={onDelete} onEdit={onEdit} onCreate={onCreate} />
            ) : (
                <p>No expenses found.</p>
            )}
        </div>
    );
}

export default LastExpense;