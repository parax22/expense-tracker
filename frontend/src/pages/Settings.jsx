import { useState, useEffect } from "react";
import { Typography, Select, MenuItem, Button } from "@mui/material";

function Settings() {
    const [currency, setCurrency] = useState("USD");

    useEffect(() => {
        const storedCurrency = localStorage.getItem("preferredCurrency");
        if (storedCurrency) {
            setCurrency(storedCurrency);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("preferredCurrency", currency);
        alert("Settings saved!");
    };

    const handleCancel = () => {
        const storedCurrency = localStorage.getItem("preferredCurrency");
        setCurrency(storedCurrency || "USD");
    };

    return (
        <>
            <Typography variant="h5">Settings</Typography>
            <Typography variant="subtitle1">Preferred Currency:</Typography>
            <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="JPY">JPY</MenuItem>
                <MenuItem value="PEN">PEN</MenuItem>
                <MenuItem value="ARS">ARS</MenuItem>
                <MenuItem value="CLP">CLP</MenuItem>

            </Select>
            <div style={{ marginTop: 20 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel} style={{ marginLeft: 10 }}>
                    Cancel
                </Button>
            </div>
        </>
    );
}

export default Settings;
