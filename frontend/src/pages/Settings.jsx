import { useState, useEffect } from "react";
import { Button, ProgressSpinner, Card, Dropdown } from "../ui";
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
        const storedCurrency = localStorage.getItem("preferred_currency");
        if (storedCurrency) {
            setCurrency(storedCurrency);
        } else {
            getSettings();
        }
    }, []);
    

    const getSettings = () => {
        api.get("/api/settings/")
            .then((res) => res.data)
            .then((data) => {
                setCurrency(data[0].preferred_currency || 'USD');
                localStorage.setItem("preferred_currency", data[0].preferred_currency || 'USD');
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            });
    };

    const handleSave = () => {
        setLoading(true);
        api.put("/api/settings/update/", { preferred_currency: currency })
            .then(() => {
                getSettings();
            })
            .then(() => {
                createAlert("Settings updated successfully!", "success");
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            })
            .finally(() => setLoading(false));
    };

    const handleCancel = () => {
        const storedCurrency = localStorage.getItem("preferred_currency");
        setCurrency(storedCurrency || "USD");
    };

    const currencyOptions = [
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
        { label: "GBP", value: "GBP" },
        { label: "JPY", value: "JPY" },
        { label: "PEN", value: "PEN" },
        { label: "ARS", value: "ARS" },
        { label: "CLP", value: "CLP" }
    ];

    return (
        <Card title="Settings">
            {loading ? (
                <div className="flex justify-center items-center">
                    <ProgressSpinner strokeWidth="4" />
                </div>
            ) : (
                <div className="flex flex-column gap-1">
                    <h3 className="font-medium">Preferred Currency:</h3>
                    <Dropdown
                        className="w-min"
                        value={currency}
                        options={currencyOptions}
                        onChange={(e) => setCurrency(e.value)}
                        placeholder="Select Currency"
                    />
                    <div className="flex gap-4 mt-4">
                        <Button label="Save" icon="pi pi-save" onClick={handleSave}/>
                        <Button label="Cancel" icon="pi pi-times" onClick={handleCancel} severity="danger"/>
                    </div>
                </div>
            )}

            <SnackbarAlert
                open={openSnackbar}
                severity={severity}
                message={alertMessage}
                onClose={() => setOpenSnackbar(false)}
            />
        </Card>
    );
}

export default Settings;