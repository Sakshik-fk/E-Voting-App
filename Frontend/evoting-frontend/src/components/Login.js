import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import authTheme from "./authTheme";

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);
      setIsAuth(true);
      navigate("/elections");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={authTheme.page}>
      <div style={authTheme.bgIconMain}>🗳️</div>
      {authTheme.bgSymbols.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
            fontSize: b.fontSize,
            opacity: b.opacity,
            animation: `floatDiagonal ${b.floatSpeed} linear infinite`,
          }}
        >
          {b.symbol}
        </div>
      ))}

      <div style={authTheme.card}>
        <h1 style={authTheme.heading}>E-Voting Portal</h1>
        <p style={authTheme.tagline}>Secure • Transparent • Trusted Elections</p>

        <form onSubmit={handleLogin}>
          <input
            style={authTheme.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={authTheme.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={authTheme.button} type="submit">Login</button>
        </form>

        <p style={authTheme.footerText}>
          New user?{" "}
          <span style={authTheme.link} onClick={() => navigate("/register")}>
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
