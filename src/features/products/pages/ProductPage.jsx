import { MainLayout } from "../../../components/layout/MainLayout";
import { Typography, Box } from "@mui/material";
import { ProductsList } from "../components/ProductList";

export function ProductsPage() {
  return (
    <MainLayout>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage the products used in your services, such as cleaning
          supplies, materials and accessories.
        </Typography>
      </Box>

      <ProductsList />
    </MainLayout>
  );
}