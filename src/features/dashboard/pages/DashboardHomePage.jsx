import { useAuthContext } from "../../../App/providers/AuthProvider";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from "@mui/material";

export function DashboardHomePage() {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    // o PrivateRoute vai redirecionar para /login automaticamente
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Painel - Sistema de Agendamentos
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.name} ({user.email})
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Bem-vindo, {user?.name || "usuário"}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aqui futuramente você verá o resumo da agenda, faturamento,
          próximos compromissos, etc.
        </Typography>
      </Container>
    </Box>
  );
}