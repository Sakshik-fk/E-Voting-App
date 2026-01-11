import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1️⃣ Clear auth
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // 2️⃣ Redirect to login
    navigate("/", { replace: true });

    // 3️⃣ Hard refresh (prevents stuck state)
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "6px 12px",
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "15px"
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
