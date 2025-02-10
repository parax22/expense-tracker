import { useState, useEffect } from "react";
import api from "../api";
import Expense from "../components/Expense";
import Grid from '@mui/material/Grid2';
import { Typography, Paper } from '@mui/material';
import ExpenseForm from "../components/ExpenseForm";

function Dashboard() {
    const preferredCurrency = localStorage.getItem("preferredCurrency") || "USD";

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        getExpenses();
    }, []);

    const getExpenses = () => {
        api.get("/api/expenses/")
            .then((res) => res.data)
            .then((data) => {
                setExpenses(data);
            })
            .catch((err) => alert(err));
    };

    const deleteExpense = (id) => {
        api
            .delete(`/api/expenses/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Expense deleted!");
                else alert("Failed to delete Expense.");
                getExpenses();
            })
            .catch((error) => alert(error));
    };

    

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <Paper elevation={3} style={{ padding: 20 }}>
                        <Typography variant="h5" gutterBottom><strong>Latest Expense</strong></Typography>
                        {
                            expenses.length > 0 ? (
                                <Expense expense={expenses[expenses.length - 1]} onDelete={deleteExpense} />
                            ) : (
                                <p>No expenses found.</p>
                            )
                        }
                    </Paper>
                </Grid>
                <Grid size={8}>
                    <Paper elevation={3} style={{ padding: 20 }}>
                        <Typography variant="h6" gutterBottom><strong>Total Expenses</strong></Typography>   
                    </Paper>
                </Grid>
            </Grid>
            <ExpenseForm getExpenses={getExpenses}/>
        </>
    );
}

export default Dashboard;
