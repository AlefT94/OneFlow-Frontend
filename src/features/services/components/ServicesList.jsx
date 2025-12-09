// src/features/services/components/ServicesList.jsx
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
import { getServices, deleteService } from "../api/servicesApi";
import { ServiceFormDialog } from "./ServiceFormDialog";

export function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenCreate = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedService(null);
  };

  const handleSaved = (savedService, isEdit) => {
    if (isEdit) {
      setServices((prev) =>
        prev.map((s) => (s.id === savedService.id ? savedService : s))
      );
    } else {
      setServices((prev) => [...prev, savedService]);
    }
  };

  const handleDelete = async (id) => {
    // depois você pode colocar um dialog de confirmação
    await deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const renderDesktopTable = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
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

          {!loading && services.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                No services found. Click &quot;New service&quot; to create your
                first one.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            services.map((service) => (
              <TableRow key={service.id} hover>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell align="right">
                  ${service.price.toFixed(2)}
                </TableCell>
                <TableCell>{service.notes}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(service)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(service.id)}
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

      {!loading && services.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No services found. Tap &quot;New service&quot; to create your first
          one.
        </Typography>
      )}

      {!loading &&
        services.map((service) => (
          <Card key={service.id} variant="outlined">
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
                    {service.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    ${service.price.toFixed(2)}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>

                {service.notes && (
                  <Typography variant="caption" color="text.secondary">
                    Notes: {service.notes}
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
                    onClick={() => handleOpenEdit(service)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(service.id)}
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
      {/* Header da lista */}
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
        <Typography variant="subtitle1">Registered services</Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          fullWidth={isMobile}
        >
          New service
        </Button>
      </Box>

      {/* Desktop: tabela / Mobile: cards */}
      {isMobile ? renderMobileCards() : renderDesktopTable()}

      <ServiceFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        onSaved={handleSaved}
        initialData={selectedService}
      />
    </Box>
  );
}