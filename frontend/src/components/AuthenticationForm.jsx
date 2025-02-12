import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText, Button, ProgressSpinner, FloatLabel, Password } from "../ui";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import SnackbarAlert from "../components/SnackbarAlert";


function AuthenticationForm({ route, method }) {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const createAlert = (message, severity) => {
        setAlertMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };

    const navigate = useNavigate();
    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                await getSettings();
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            createAlert(error.message || "Something went wrong!", "error");
        } finally {
            setLoading(false);
        }
    };

    const getSettings = () => {
        api.get("/api/settings/")
            .then((res) => res.data)
            .then((data) => {
                localStorage.setItem("preferred_currency", data[0].preferred_currency || 'USD');
            })
            .catch((err) => {
                createAlert(err.message || "Something went wrong!", "error");
            });
    };

    return (
        <>
            <div className="flex justify-content-center align-items-center min-h-screen">
                <div className="p-4 shadow-2 border-round surface-card xl:w-3 lg:w-4 md:w-5 sm:w-6">
                    <h2 className="text-center">{name}</h2>
                    <form onSubmit={handleSubmit} className="flex flex-column gap-3">
                        <div>
                            <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                            <InputText id="username" className="w-full" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                            <Password 
                                id="password"
                                className="w-full"
                                inputClassName="w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                feedback={method === "register"}
                                pt={{ iconField: { root: { style: {width: "100%"}} } }}
                                toggleMask
                                required/>
                        </div>
                        <Button type="submit" label={name} icon={loading ? "pi pi-spin pi-spinner" : ""} disabled={loading} />
                        <p className="flex justify-content-center align-items-center">
                            {method === "login" ? "Don't have an account?" : "Already have an account?"}
                            <Button 
                                type="button"
                                label={method === "login" ? "Register" : "Login"}
                                onClick={() => navigate(method === "login" ? "/register" : "/login")}
                                text
                            />
                        </p>
                    </form>
                </div>
            </div>
            <SnackbarAlert
                open={openSnackbar}
                severity={severity}
                message={alertMessage}
                onClose={() => setOpenSnackbar(false)}
            />
        </>
    );
}

export default AuthenticationForm;