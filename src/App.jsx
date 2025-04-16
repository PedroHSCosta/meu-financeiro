import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import ContasBancarias from "./pages/ContasBancarias";
import ContasAPagar from "./pages/ContasAPagar";
import Graficos from "./pages/Graficos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {user && <Sidebar />}

      <div className={`${user ? "lg:ml-64" : ""} flex-1 p-6 bg-gray-50`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/transacoes"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/contas-bancarias"
            element={
              <PrivateRoute>
                <ContasBancarias />
              </PrivateRoute>
            }
          />
          <Route
            path="/contas-a-pagar"
            element={
              <PrivateRoute>
                <ContasAPagar />
              </PrivateRoute>
            }
          />
          <Route
            path="/graficos"
            element={
              <PrivateRoute>
                <Graficos />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
