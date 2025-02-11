import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Container, Typography, CircularProgress, Box } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import api from "../api";

function ExpenseForm({ getExpenses, onClose, createAlert, selectedExpense }) {
    const preferredCurrency = localStorage.getItem("preferred_currency") || "USD";

    const [loading, setLoading] = useState(false);

    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [currency, setCurrency] = useState(preferredCurrency);
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(dayjs());

    const [errors, setErrors] = useState({
        description: "",
        category: "",
        amount: "",
    });

    useEffect(() => {
        if (selectedExpense) {
            setDescription(selectedExpense.description);
            setCategory(selectedExpense.category_name);
            setCurrency(selectedExpense.currency);
            setAmount(selectedExpense.amount);
            setDate(dayjs(selectedExpense.date));
        }
        else {
            resetForm();
        }
    }, [selectedExpense]);

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);
        setErrors({ ...errors, description: value.length > 50 ? "Max 50 characters allowed" : "" });
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategory(value);
        setErrors({ ...errors, category: value.length > 20 ? "Max 20 characters allowed" : "" });
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,8}(\.\d{0,2})?$/.test(value) || value === "") {
            setAmount(value);
            setErrors({ ...errors, amount: "" });
        } else {
            setErrors({ ...errors, amount: "Max 8 digits and 2 decimals allowed" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (errors.description || errors.category || errors.amount) {
            createAlert("Please fix the errors before submitting.", "error");
            return;
        }

        const data = { description, category_name: category, currency, amount, date: date.format("YYYY-MM-DD") };
        if (selectedExpense) {
            updateExpense(selectedExpense.id, data);
        } else {
            createExpense(data);
        }
        resetForm();
    };

    const createExpense = (data) => {
        setLoading(true);
        api.post("/api/expenses/", data)
            .then((res) => {
                if (res.status === 201) {
                    createAlert("Expense created successfully.", "success");
                    getExpenses();
                    onClose();
                    resetForm();
                } else {
                    createAlert("Failed to create Expense.", "error");
                }
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const updateExpense = (id, data) => {
        setLoading(true);
        api.put(`/api/expenses/update/${id}/`, data)
            .then((res) => {
                if (res.status === 200) {
                    createAlert("Expense updated!", "success");
                    getExpenses();
                    onClose();
                    resetForm();
                }
                else {
                    createAlert("Failed to update Expense.", "error");
                }
            })
            .catch((error) => {
                createAlert(error.message || "Something went wrong!", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const resetForm = () => {
        setDescription("");
        setCategory("");
        setCurrency(preferredCurrency);
        setAmount("");
        setDate(dayjs());
        setErrors({
            description: "",
            category: "",
            amount: "",
        });
    };

    return (
        <Container maxWidth="sm">
            {
                loading ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                        <CircularProgress />
                    </Box> :
                    <>
                        <Typography variant="h5" gutterBottom>
                            {selectedExpense ? "Edit Expense" : "Add Expense"}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Description"
                                fullWidth
                                value={description}
                                onChange={handleDescriptionChange}
                                error={!!errors.description}
                                helperText={errors.description || ""}
                                required
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                label="Category"
                                fullWidth
                                value={category}
                                onChange={handleCategoryChange}
                                error={!!errors.category}
                                helperText={errors.category || ""}
                                required
                                sx={{ mt: 2 }}
                            />
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid size={6}>
                                    <TextField
                                        label="Amount"
                                        fullWidth
                                        value={amount}
                                        onChange={handleAmountChange}
                                        error={!!errors.amount}
                                        helperText={errors.amount || ""}
                                        required
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="currency-label">Currency</InputLabel>
                                        <Select
                                            labelId="currency-label"
                                            id="currency"
                                            value={currency}
                                            label="Currency"
                                            onChange={(e) => setCurrency(e.target.value)}
                                        >
                                            <MenuItem value="USD">USD</MenuItem>
                                            <MenuItem value="EUR">EUR</MenuItem>
                                            <MenuItem value="GBP">GBP</MenuItem>
                                            <MenuItem value="JPY">JPY</MenuItem>
                                            <MenuItem value="PEN">PEN</MenuItem>
                                            <MenuItem value="ARS">ARS</MenuItem>
                                            <MenuItem value="CLP">CLP</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <DatePicker
                                label="Date"
                                fullWidth
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                sx={{ mt: 2 }}
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                {selectedExpense ? "Update Expense" : "Add Expense"}
                            </Button>
                        </form>
                    </>
            }
        </Container>
    );
}

export default ExpenseForm;