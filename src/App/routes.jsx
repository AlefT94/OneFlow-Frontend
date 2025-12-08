import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { SignUpPage } from "../features/auth/pages/SignUpPage";
import { EmailConfirmationPage } from "../features/auth/pages/EmailConfirmationPage";
import {useAuthContext} from "./providers/AuthProvider";
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
        {/* Public auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/confirm-email" element={<EmailConfirmationPage />} />

        {/* Private routes */}
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