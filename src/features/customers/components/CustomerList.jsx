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
  getCustomers,
  deleteCustomer,
} from "../api/customersApi";
import { CustomerFormDialog } from "./CustomerFormDialog";

export function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleOpenCreate = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaved = (savedCustomer, isEdit) => {
    if (isEdit) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === savedCustomer.id ? savedCustomer : c))
      );
    } else {
      setCustomers((prev) => [...prev, savedCustomer]);
    }
  };

  const handleDelete = async (id) => {
    await deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const renderDesktopTable = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          )}

          {!loading && customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                No customers found. Click &quot;New customer&quot; to
                create your first one.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            customers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.notes}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(customer)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(customer.id)}
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

      {!loading && customers.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No customers found. Tap &quot;New customer&quot; to create
          your first one.
        </Typography>
      )}

      {!loading &&
        customers.map((customer) => (
          <Card key={customer.id} variant="outlined">
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
                    {customer.name}
                  </Typography>
                </Box>

                {customer.phone && (
                  <Typography variant="body2">
                    Phone: {customer.phone}
                  </Typography>
                )}

                {customer.email && (
                  <Typography variant="body2">
                    Email: {customer.email}
                  </Typography>
                )}

                {customer.address && (
                  <Typography variant="body2" color="text.secondary">
                    {customer.address}
                  </Typography>
                )}

                {customer.notes && (
                  <Typography variant="caption" color="text.secondary">
                    Notes: {customer.notes}
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
                    onClick={() => handleOpenEdit(customer)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(customer.id)}
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
        <Typography variant="subtitle1">Registered customers</Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          fullWidth={isMobile}
        >
          New customer
        </Button>
      </Box>

      {/* Desktop: tabela / Mobile: cards */}
      {isMobile ? renderMobileCards() : renderDesktopTable()}

      <CustomerFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        onSaved={handleSaved}
        initialData={selectedCustomer}
      />
    </Box>
  );
}