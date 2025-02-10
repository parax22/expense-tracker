import { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Container, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import api from "../api";

function ExpenseForm({ getExpenses }) {
    const preferredCurrency = localStorage.getItem("preferredCurrency") || "USD";

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

    const createExpense = (e) => {
        e.preventDefault();

        if (errors.description || errors.category || errors.amount) {
            alert("Please fix the errors before submitting.");
            return;
        }

        const formattedDate = date.format("YYYY-MM-DD");
        console.log({ description, category, currency, amount, formattedDate });

        api.post("/api/expenses/", { description, category, currency, amount, date:formattedDate })
            .then((res) => {
                if (res.status === 201) {
                    alert("Expense created!");
                    setDescription("");
                    setCategory("");
                    setCurrency(preferredCurrency);
                    setAmount("");
                    setDate(dayjs());
                    getExpenses();
                } else {
                    alert("Failed to make expense.");
                }
            })
            .catch((err) => alert(err.message));
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                Add Expense
            </Typography>
            <form onSubmit={createExpense}>
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
                    Add Expense
                </Button>
            </form>
        </Container>
    );
}

export default ExpenseForm;
