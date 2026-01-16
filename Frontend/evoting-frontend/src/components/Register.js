import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import authTheme from "./authTheme";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", { name, email, password, role });
      alert("✅ Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
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
        <h2 style={authTheme.heading}>Create Account</h2>
        <p style={authTheme.tagline}>Join the secure digital voting platform</p>

        <form onSubmit={handleRegister}>
          <input
            style={authTheme.input}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            style={authTheme.input}
            type="email"
            placeholder="Email Address"
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

          <select
            style={authTheme.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>

          <button style={authTheme.button} type="submit">Register</button>
        </form>

        <p style={authTheme.footerText}>
          Already registered?{" "}
          <span style={authTheme.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
