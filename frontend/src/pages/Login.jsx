import { useState } from "react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, user } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const response = await login(email, password);

      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
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
        <h1>Welcome Back</h1>

        <p>Login to your account</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;