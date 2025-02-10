import AuthenticationForm from "../components/AuthenticationForm";

function Register() {
    return <AuthenticationForm route="/api/user/register/" method="register" />
}

export default Register;