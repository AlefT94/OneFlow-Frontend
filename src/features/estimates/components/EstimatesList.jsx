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
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  getEstimates,
  deleteEstimate,
  approveEstimate,
} from "../api/estimatesApi";
import { EstimateFormDialog } from "./EstimateFormDialog";

export function EstimatesList() {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadEstimates = async () => {
    try {
      setLoading(true);
      const data = await getEstimates();
      setEstimates(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  const handleOpenCreate = () => {
    setSelectedEstimate(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (estimate) => {
    setSelectedEstimate(estimate);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEstimate(null);
  };

  const handleSaved = (savedEstimate, isEdit) => {
    if (isEdit) {
      setEstimates((prev) =>
        prev.map((q) => (q.id === savedEstimate.id ? savedEstimate : q))
      );
    } else {
      setEstimates((prev) => [...prev, savedEstimate]);
    }
  };

  const handleDelete = async (id) => {
    await deleteEstimate(id);
    setEstimates((prev) => prev.filter((q) => q.id !== id));
  };

  const handleApprove = async (id) => {
    const updated = await approveEstimate(id);
    setEstimates((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  };

  const renderStatusChip = (status) => {
    const color = status === "Approved" ? "success" : "warning";
    return (
      <Chip
        label={status}
        color={color}
        size="small"
        variant={status === "Approved" ? "filled" : "outlined"}
      />
    );
  };

  const calcTotal = (estimate) =>
    estimate.items?.reduce(
      (sum, item) => sum + (item.quantity || 1) * item.unitPrice,
      0
    ) || 0;

  const renderDesktopTable = () => (
    <TableContainer component={Paper}>
      <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Estimate #</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Total</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5}>Loading...</TableCell>
            </TableRow>
          )}

          {!loading && estimates.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                No estimates found. Click &quot;New estimate&quot; to create
                your first one.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            estimates.map((estimate) => (
              <TableRow key={estimate.id} hover>
                <TableCell>{estimate.estimateNumber || "-"}</TableCell>
                <TableCell>{estimate.date}</TableCell>
                <TableCell>{estimate.customerName}</TableCell>
                <TableCell>{renderStatusChip(estimate.status)}</TableCell>
                <TableCell align="right">
                  ${calcTotal(estimate).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(estimate)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleApprove(estimate.id)}
                    disabled={estimate.status === "Approved"}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(estimate.id)}
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

      {!loading && estimates.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No estimates found. Tap &quot;New estimate&quot; to create your
          first one.
        </Typography>
      )}

      {!loading &&
        estimates.map((estimate) => (
          <Card key={estimate.id} variant="outlined">
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
                    {estimate.customerName}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    #{estimate.estimateNumber || "-"}
                  </Typography>
                  {renderStatusChip(estimate.status)}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Date: {estimate.date}
                </Typography>

                <Typography variant="body2">
                  Total: ${calcTotal(estimate).toFixed(2)}
                </Typography>

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
                    onClick={() => handleOpenEdit(estimate)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleApprove(estimate.id)}
                    disabled={estimate.status === "Approved"}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(estimate.id)}
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
        <Typography variant="subtitle1">Registered estimates</Typography>
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          fullWidth={isMobile}
        >
          New estimate
        </Button>
      </Box>

      {isMobile ? renderMobileCards() : renderDesktopTable()}

      <EstimateFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        onSaved={handleSaved}
        initialData={selectedEstimate}
      />
    </Box>
  );
}