import { useState, useEffect } from "react";
import api from "../api";
import Expense from "../components/Expense";
import Grid from '@mui/material/Grid2';
import { Box, Typography, Paper, Button, Dialog, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import ExpenseForm from "../components/ExpenseForm";
import SnackbarAlert from "../components/SnackbarAlert";

function Dashboard() {
    const preferredCurrency = localStorage.getItem("preferredCurrency") || "USD";

    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const createAlert = (message, severity) => {
        setAlertMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };

    useEffect(() => {
        getExpenses();
    }, []);

    const getExpenses = () => {
        setLoading(true);
        api.get("/api/expenses/")
            .then((res) => res.data)
            .then((data) => {
                setExpenses(data);
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            })
            .finally(() => setLoading(false));
    };

    const deleteExpense = (id) => {
        api
            .delete(`/api/expenses/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    createAlert("Expense deleted!", "success");
                }
                else {
                    createAlert("Failed to delete Expense.", "error");
                }
                getExpenses();
            })
            .catch((error) => {
                createAlert(error.message || "Something went wrong!", "error");
            });
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <Paper elevation={3} style={{ padding: 20 }}>
                        <Typography variant="h5" gutterBottom><strong>Latest Expense</strong></Typography>
                        {
                            loading ?
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box> :
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
            <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mt: 2 }}>
                Create New Expense
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <ExpenseForm getExpenses={getExpenses} onClose={() => setOpen(false)} createAlert={createAlert} />
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <SnackbarAlert
                open={openSnackbar}
                severity={severity}
                message={alertMessage}
                onClose={() => setOpenSnackbar(false)}
            />
        </>
    );
}

export default Dashboard;
