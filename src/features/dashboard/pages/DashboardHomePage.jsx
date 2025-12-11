import { MainLayout } from "../../../components/layout/MainLayout";
import { Typography, Box } from "@mui/material";
import { useAuthContext } from "../../../App/providers/AuthProvider";

export function DashboardHomePage() {
  const { user } = useAuthContext();

  return (
    <MainLayout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name || "user"}! Here you will soon see an
          overview of your schedule, billing and key metrics.
        </Typography>
      </Box>
    </MainLayout>
  );
}