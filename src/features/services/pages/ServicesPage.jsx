import { MainLayout } from "../../../components/layout/MainLayout";
import { Typography, Box } from "@mui/material";
import { ServicesList } from "../components/ServicesList";

export function ServicesPage() {
  return (
    <MainLayout>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Services
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage the services your company offers (e.g. automotive detailing,
          exterior wash, polishing, etc.).
        </Typography>
      </Box>

      <ServicesList />
    </MainLayout>
  );
}