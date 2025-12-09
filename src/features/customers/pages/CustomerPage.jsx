import { MainLayout } from "../../../components/layout/MainLayout";
import { Typography, Box } from "@mui/material";
import { CustomersList } from "../components/CustomerList";

export function CustomersPage() {
  return (
    <MainLayout>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your customers&apos; information to speed up scheduling and
          communication.
        </Typography>
      </Box>

      <CustomersList />
    </MainLayout>
  );
}