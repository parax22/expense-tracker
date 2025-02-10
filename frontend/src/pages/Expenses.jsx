import { Typography, Paper, Button, CircularProgress, Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import api from "../api";
import DeleteIcon from "@mui/icons-material/Delete";

function Expenses() {
    useEffect(() => {
        getExpenses();
    }, []);

    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);

    const getExpenses = () => {
        setLoading(true);
        api.get("/api/expenses/")
            .then((res) => res.data)
            .then((data) => {
                setExpenses(data);
            })
            .catch((err) => alert(err))
            .finally(() => setLoading(false));
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

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "description", headerName: "Description", width: 200 },
        { field: "category", headerName: "Category", width: 150 },
        { field: "amount", headerName: "Amount", width: 150 },
        { field: "currency", headerName: "Currency", width: 100 },
        { field: "date", headerName: "Date", width: 150 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteExpense(params.row.id)}
                >
                    <DeleteIcon />
                </Button>
            ),
        }
    ]

    return (
        <>
            <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h5" sx={{ mb: 2 }}><strong>Expenses</strong></Typography>
                {
                    loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) :
                        <>
                            <DataGrid
                                rows={expenses}
                                columns={columns}
                                rowCount={expenses.length}
                                paginationMode="server"
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 10
                                        }
                                    }
                                }}
                                pageSizeOptions={[10, 25, 50]}
                                disableRowSelectionOnClick
                            />
                        </>
                }
            </Paper>
        </>
    );
}

export default Expenses;