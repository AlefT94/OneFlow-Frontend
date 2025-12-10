import { MainLayout } from "../../../components/layout/MainLayout";
import { Typography, Box } from "@mui/material";
import { EstimatesList } from "../components/EstimatesList";

export function EstimatesPage() {
  return (
    <MainLayout>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Estimates
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your service and product estimates for customers.
        </Typography>
      </Box>

      <EstimatesList />
    </MainLayout>
  );
}