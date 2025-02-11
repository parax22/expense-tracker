import { useState, useEffect } from "react";
import { Typography, Select, MenuItem, Button, CircularProgress, Box, Paper } from "@mui/material";
import api from "../api";
import SnackbarAlert from "../components/SnackbarAlert";

function Settings() {
    const [currency, setCurrency] = useState("");
    const [loading, setLoading] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');

    const createAlert = (message, severity) => {
        setAlertMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };

    useEffect(() => {
        getSettings();
    }, []);

    const getSettings = () => {
        setLoading(true);
        api.get("/api/settings/")
            .then((res) => res.data)
            .then((data) => {
                setCurrency(data[0].preferred_currency || 'USD');
                localStorage.setItem("preferred_currency", data[0].preferred_currency || 'USD');
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            })
            .finally(() => setLoading(false));
    };

    const handleSave = () => {
        api.put("/api/settings/update/", { preferred_currency: currency })
            .then(() => {
                createAlert("Settings saved!", "success");
                getSettings();
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            });
    };

    const handleCancel = () => {
        const storedCurrency = localStorage.getItem("preferred_currency");
        setCurrency(storedCurrency || "USD");
    };

    return (
        <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom><strong>Settings</strong></Typography>
            {loading ?
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
                :
                <>
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
            }

            <SnackbarAlert
                open={openSnackbar}
                severity={severity}
                message={alertMessage}
                onClose={() => setOpenSnackbar(false)}
            />
        </Paper>
    );
}

export default Settings;
