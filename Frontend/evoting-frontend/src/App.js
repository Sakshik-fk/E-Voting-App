import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Elections from "./components/Elections";
import Candidates from "./components/Candidates";
import Results from "./components/Results";
import CreateElection from "./components/CreateElection";
import AddCandidate from "./components/AddCandidate";

// ✅ STEP 1 — auth state instead of function
function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuth
              ? <Navigate to="/elections" />
              : <Navigate to="/login" />
          }
        />

        {/* ✅ STEP 2 — pass setIsAuth to Login */}
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/elections"
          element={
            isAuth
              ? <Elections />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/add-candidate/:electionId"
          element={<AddCandidate />}
        />

        <Route path="/candidates/:electionId" element={<Candidates />} />
        <Route path="/results/:electionId" element={<Results />} />

        <Route path="/create-election" element={<CreateElection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
