import { useState } from "react";

import {
    Link,
    Navigate,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { register, user } = useAuth();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (user) {
        return (
            <Navigate
                to={
                    user.role === "admin"
                        ? "/admin"
                        : "/dashboard"
                }
                replace
            />
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await register(
                name,
                email,
                password,
                role,
            );

            if (response.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >
                <h1>Create Account</h1>

                <p>Register to get started</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <label>Full Name</label>

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                />

                <label>Email Address</label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />

                <label>Password</label>

                <div className="password-box">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        maxLength={72}
                        required
                    />

                    <button
                        type="button"
                        style={{"backgroundColor": "transparent", "width": "50px", "color": "black"}}
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <label>Select Role</label>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{"width": "100%", "padding": "10px","paddingRight": "10px"}}
                    required
                >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;