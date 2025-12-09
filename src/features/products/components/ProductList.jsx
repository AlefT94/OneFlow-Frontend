import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getProducts,
  deleteProduct,
} from "../api/productsApi";
import { ProductFormDialog } from "./ProductFormDialog";

export function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleSaved = (savedProduct, isEdit) => {
    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
      );
    } else {
      setProducts((prev) => [...prev, savedProduct]);
    }
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const renderDesktopTable = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5}>Loading...</TableCell>
            </TableRow>
          )}

          {!loading && products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                No products found. Click &quot;New product&quot; to
                create your first one.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell align="right">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell>{product.notes}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(product)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {loading && (
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      )}

      {!loading && products.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No products found. Tap &quot;New product&quot; to create your
          first one.
        </Typography>
      )}

      {!loading &&
        products.map((product) => (
          <Card key={product.id} variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {product.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>

                {product.unit && (
                  <Typography variant="body2">
                    Unit: {product.unit}
                  </Typography>
                )}

                {product.notes && (
                  <Typography variant="caption" color="text.secondary">
                    Notes: {product.notes}
                  </Typography>
                )}

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(product)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
    </Stack>
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          mb: 2,
          gap: isMobile ? 1.5 : 0,
          alignItems: isMobile ? "stretch" : "center",
        }}
      >
        <Typography variant="subtitle1">Registered products</Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          fullWidth={isMobile}
        >
          New product
        </Button>
      </Box>

      {/* Desktop: tabela / Mobile: cards */}
      {isMobile ? renderMobileCards() : renderDesktopTable()}

      <ProductFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        onSaved={handleSaved}
        initialData={selectedProduct}
      />
    </Box>
  );
}