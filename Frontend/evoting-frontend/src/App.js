import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Elections from "./components/Elections";
import Candidates from "./components/Candidates";
import Results from "./components/Results";

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/elections" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/elections"
          element={
            isAuthenticated()
              ? <Elections />
              : <Navigate to="/login" />
          }
        />

        <Route path="/candidates/:electionId" element={<Candidates />} />
        <Route path="/results/:electionId" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
