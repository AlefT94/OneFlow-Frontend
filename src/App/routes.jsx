import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { useAuthContext } from "./providers/AuthProvider";
import { DashboardHomePage } from "../features/dashboard/pages/DashboardHomePage";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div>Carregando...</div>; // pode virar um spinner depois
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardHomePage />
            </PrivateRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}