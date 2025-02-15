import Expense from "../common/Expense";
import { Button } from "../../ui";

function LastExpense({ expense, onDelete, onEdit, onCreate }) {
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
            {
                expense ? (
                    <Expense expense={expense} isRecurring={false} onDelete={onDelete} onEdit={onEdit} onCreate={onCreate} />
                ) : (
                    <p>No expenses found.</p>
                )
            }
        </div>
    );
}

export default LastExpense;