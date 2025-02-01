import React from "react";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import "../styles/Expense.css";

function Expense({ expense, onDelete }) {
    const formattedDate = new Date(expense.date).toLocaleDateString("en-US");

    return (
        <div className="expense-container">
            <p className="expense-descripton">{expense.description}</p>
            <p className="expense-category">{expense.category}</p>
            <p className="expense-amount"><span>{expense.currency}</span> {expense.amount}</p>
            <p>{formattedDate}</p>
            <Button onClick={() => onDelete(expense.id)} variant="outlined" color="error" startIcon={<DeleteIcon />}>
                Delete
            </Button>
        </div>
    );
}

export default Expense;