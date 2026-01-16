// src/themes/authTheme.js
const authTheme = {
  page: {
    height: "100vh",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
  },

  bgIconMain: {
    position: "absolute",
    fontSize: "240px",
    opacity: 0.06,
    color: "#fff",
    left: "5%",
    bottom: "5%",
    animation: "floatDiagonal 25s ease-in-out infinite alternate",
  },

  bgSymbols: [
    { top: "10%", right: "35%", fontSize: "34px", opacity: 0.08, symbol: "🏛️", floatSpeed: "25s" },
    { top: "55%", right: "8%", fontSize: "40px", opacity: 0.07, symbol: "🧾", floatSpeed: "30s" },
    { bottom: "12%", left: "30%", fontSize: "36px", opacity: 0.08, symbol: "☑️", floatSpeed: "22s" },
    { top: "38%", left: "4%", fontSize: "44px", opacity: 0.06, symbol: "📈", floatSpeed: "28s" },
    { bottom: "35%", right: "32%", fontSize: "32px", opacity: 0.07, symbol: "🧑‍⚖️", floatSpeed: "32s" },
    { top: "22%", left: "42%", fontSize: "28px", opacity: 0.05, symbol: "🗂️", floatSpeed: "24s" },
    { top: "18%", left: "12%", fontSize: "28px", opacity: 0.05, symbol: "✔", floatSpeed: "20s" },
    { top: "70%", left: "18%", fontSize: "28px", opacity: 0.05, symbol: "👥", floatSpeed: "27s" },
    { top: "30%", right: "15%", fontSize: "28px", opacity: 0.05, symbol: "🔒", floatSpeed: "26s" },
    { bottom: "20%", right: "20%", fontSize: "28px", opacity: 0.05, symbol: "📊", floatSpeed: "29s" },
  ],

  card: {
    width: "380px",
    padding: "42px",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
    textAlign: "center",
    zIndex: 2,
  },

  heading: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1e3a8a",
    marginBottom: "6px",
  },

  tagline: {
    fontSize: "14px",
    color: "#475569",
    marginBottom: "30px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #c7d2fe",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
  },

  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "18px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #2563eb, #1e40af)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  footerText: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#334155",
  },

  link: {
    color: "#2563eb",
    fontWeight: "600",
    cursor: "pointer",
  },

  passwordContainer: {
    position: "relative",
  },

  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "18px",
    color: "#475569",
  },
};

/* Global hover/focus effects and floating animations */
const sheet = document.styleSheets[0];
sheet.insertRule(`
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.45);
  }
`, sheet.cssRules.length);

sheet.insertRule(`
  span:hover {
    text-decoration: underline;
  }
`, sheet.cssRules.length);

sheet.insertRule(`
  input:focus, select:focus {
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  }
`, sheet.cssRules.length);

sheet.insertRule(`
  @keyframes floatDiagonal {
    0% { transform: translate(0, 0); }
    25% { transform: translate(10px, -10px); }
    50% { transform: translate(-10px, 10px); }
    75% { transform: translate(5px, -5px); }
    100% { transform: translate(0, 0); }
  }
`, sheet.cssRules.length);

export default authTheme;
