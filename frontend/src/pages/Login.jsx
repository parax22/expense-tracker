import AuthenticationForm from "../components/AuthenticationForm";

function Login() {
    return <AuthenticationForm route="/api/token/" method="login" />
}

export default Login;