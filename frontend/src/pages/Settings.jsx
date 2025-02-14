import { useState, useEffect } from "react";
import { Button, ProgressSpinner, Card, Dropdown } from "../ui";
import SnackbarAlert from "../components/SnackbarAlert";
import { SettingService } from "../services/api/settingService";
import { Setting } from "../models/setting";
import { PREF_CURRENCY } from "../constants";

function Settings() {
    const settingService = new SettingService();
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
        const storedCurrency = localStorage.getItem(PREF_CURRENCY);
        if (storedCurrency) {
            setCurrency(storedCurrency);
        } else {
            getSettings();
        }
    }, []);
    

    const getSettings = () => {
        settingService.getAll()
            .then((data) => {
                setCurrency(data.preferred_currency);
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            });
    };

    const handleSave = () => {
        setLoading(true);
        settingService.update(new Setting(currency))
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
        const storedCurrency = localStorage.getItem(PREF_CURRENCY);
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