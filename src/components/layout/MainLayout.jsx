import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../App/providers/AuthProvider";

const drawerWidth = 240;

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Customers", path: "/customers" },
  { label: "Services", path: "/services" },
  { label: "Products", path: "/products" },
  { label: "Estimates", path: "/estimates" },
];

export function MainLayout({ children }) {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    // PrivateRoute cuida do redirecionamento para /login
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (!isDesktop) {
      setMobileOpen(false); // fecha o drawer no mobile ao clicar
    }
  };

  const drawerContent = (
    <Box sx={{ mt: 5 }}>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Botão de menu só no mobile */}
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleToggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            OneFlow
          </Typography>

          {user && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.name} ({user.email})
            </Typography>
          )}

          <Button color="inherit" onClick={handleLogout}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      {isDesktop ? (
        // Desktop: drawer permanente
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              mt: 8,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Mobile: drawer temporário controlado pelo ícone hamburguer
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleToggleDrawer}
          ModalProps={{
            keepMounted: true, // melhora performance no mobile
          }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // espaço pro AppBar
          bgcolor: "background.default",
          ...(isDesktop && { ml: `${30}px`,  mr: `${50}px`}), // empurra pra direita quando tiver sidebar fixa
        }}
      >
        {children}
      </Box>
    </Box>
  );
}