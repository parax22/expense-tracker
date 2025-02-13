import { Card, Button } from '../ui.js';

function Expense({ expense, isRecurring, onCreate, onDelete, onEdit }) {
    const footer = (
        <div className="flex flex-wrap gap-2 justify-content-end">
            {isRecurring && (
                <Button 
                    label="Add" 
                    size="small" 
                    severity="success" 
                    icon="pi pi-plus" 
                    onClick={() => onCreate(expense.id)} 
                />
            )}
            <Button label="Edit" size="small" severity="info" icon="pi pi-pencil" onClick={() => onEdit(expense.id, isRecurring)} />
            <Button label="Delete" size="small" severity="danger" icon="pi pi-trash" onClick={() => onDelete(expense.id)} /> 
        </div>
    )

    return (
        <Card
            className='m-1'
            title={expense.description}
            subTitle={expense.category_name}
            footer={footer}
        >
            <p className="text-xl font-semibold">{expense.amount} {expense.currency}</p>
            { !isRecurring && <p className="text-md font-light">{expense.date}</p>}
        </Card>
    );
}

export default Expense;