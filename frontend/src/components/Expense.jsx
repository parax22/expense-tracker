import { Card, Button } from '../ui.js';

function Expense({ expense, onDelete, onEdit }) {
    const footer = (
        <div className="flex gap-2">
            <Button label="Edit" size="small" severity="info" icon="pi pi-pencil" onClick={() => onEdit(expense.id)} />
            <Button label="Delete" size="small" severity="danger" icon="pi pi-trash" onClick={() => onDelete(expense.id)} />
        </div>
    )

    return (
        <Card
            className="xl:w-8 lg:w-12 m-auto"
            title={expense.description}
            subTitle={expense.category_name}
            footer={footer}
        >
            <p className="text-xl font-semibold">{expense.amount} {expense.currency}</p>
            <p className="text-md font-light">{expense.date}</p>
        </Card>
    );
}

export default Expense;