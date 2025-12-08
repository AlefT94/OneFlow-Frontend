import { AuthProvider } from "./providers/AuthProvider";
import { AppRoutes } from "./routes";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}