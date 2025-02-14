import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText, Button, Password, Toast } from "../../ui";
import { AuthService } from "../../services/api/authService";
import { SettingService } from "../../services/api/settingService";
import { useToast } from "../../hooks/useToast";
import { User } from "../../models/user";

function AuthenticationForm({ method }) {
    const authService = new AuthService();
    const settingService = new SettingService();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { showToast, toastRef } = useToast();

    const navigate = useNavigate();
    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (method === "login") {
                await authService.login(new User(username, password));
                getSettings();
                navigate("/");
            } else {
                authService.register(new User(username, password))
                    .then(() => {
                        navigate("/login");
                        showToast("Account created successfully!", "success");
                    }); 
            }
        } catch (error) {
            showToast(error.message || "Something went wrong!", "error");
        } finally {
            setLoading(false);
        }
    };

    const getSettings = () => {
        settingService.getAll()
            .catch((error) => {
                showToast(error.message || "Something went wrong!", "error");
            }
        );
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
            <Toast ref={toastRef} position="bottom-right" />
        </>
    );
}

export default AuthenticationForm;