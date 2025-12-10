import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Autocomplete,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  createEstimate,
  updateEstimate,
} from "../api/estimatesApi";
import { getCustomers } from "../../customers/api/customersApi";
import { getServices } from "../../services/api/servicesApi";
import { getProducts } from "../../products/api/productsApi";
import { EstimateItemsTable } from "./EstimateItemsTable";
import { CustomerFormDialog } from "../../customers/components/CustomerFormDialog";

export function EstimateFormDialog({
  open,
  onClose,
  onSaved,
  initialData,
}) {
  const isEdit = Boolean(initialData?.id);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    estimateNumber: "",
    date: "",
    customerId: null,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    status: "Pending",
    notes: "",
  });

  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);

  useEffect(() => {
    async function loadRefs() {
      const [c, s, p] = await Promise.all([
        getCustomers(),
        getServices(),
        getProducts(),
      ]);
      setCustomers(c);
      setServices(s);
      setProducts(p);
    }
    loadRefs();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        estimateNumber: initialData.estimateNumber || "",
        date: initialData.date || new Date().toISOString().slice(0, 10),
        customerId: initialData.customerId || null,
        customerName: initialData.customerName || "",
        customerEmail: initialData.customerEmail || "",
        customerPhone: initialData.customerPhone || "",
        customerAddress: initialData.customerAddress || "",
        status: initialData.status || "Pending",
        notes: initialData.notes || "",
      });
      setItems(initialData.items || []);
    } else {
      setForm({
        estimateNumber: "",
        date: new Date().toISOString().slice(0, 10),
        customerId: null,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        status: "Pending",
        notes: "",
      });
      setItems([]);
    }
    setError(null);
  }, [initialData, open]);

  const handleChangeField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSelectCustomer = (customer) => {
    if (!customer) {
      setForm((prev) => ({
        ...prev,
        customerId: null,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email || "",
      customerPhone: customer.phone || "",
      customerAddress: customer.address || "",
    }));
  };

  const handleAddItemFromRef = (refItem, type) => {
    if (!refItem) return;
    const newItem = {
      type, // "service" ou "product"
      refId: refItem.id,
      name: refItem.name,
      quantity: 1,
      unitPrice: refItem.price ?? 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleChangeItem = (index, item) => {
    setItems((prev) => prev.map((it, i) => (i === index ? item : it)));
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calcTotal = () =>
    items.reduce(
      (sum, item) => sum + (item.quantity || 1) * (item.unitPrice || 0),
      0
    );

  const validate = () => {
    if (!form.date) return "Date is required.";
    if (!form.customerId) return "Customer is required.";
    if (items.length === 0) return "Add at least one item to the estimate.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        items,
      };

      let saved;
      if (isEdit) {
        saved = await updateEstimate(initialData.id, payload);
      } else {
        saved = await createEstimate(payload);
      }

      onSaved(saved, isEdit);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error saving estimate. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  const handleCustomerCreated = (newCustomer, isEdit) => {
    if (!isEdit) {
      setCustomers((prev) => [...prev, newCustomer]);
      handleSelectCustomer(newCustomer);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCancel}
        fullWidth
        maxWidth="md"
        fullScreen={isXs}
      >
        <DialogTitle>
          {isEdit ? "Edit estimate" : "New estimate"}
        </DialogTitle>
        <DialogContent>
          <form id="estimate-form" onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {/* Cabeçalho: data + cliente */}
              <Stack
                direction={isXs ? "column" : "row"}
                spacing={2}
                sx={{ alignItems: isXs ? "stretch" : "flex-end" }}
              >
                <TextField
                  label="Estimate number"
                  value={form.estimateNumber}
                  onChange={(e) =>
                    handleChangeField("estimateNumber", e.target.value)
                  }
                  size="small"
                  fullWidth={isXs}
                />

                <TextField
                  label="Date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    handleChangeField("date", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth={isXs}
                />

                <Box sx={{ flex: 1 }}>
                  <Autocomplete
                    size="small"
                    options={customers}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer"
                        placeholder="Type to search..."
                      />
                    )}
                    value={
                      customers.find(
                        (c) => c.id === form.customerId
                      ) || null
                    }
                    onChange={(_, value) => handleSelectCustomer(value)}
                    fullWidth
                    disableClearable={false}
                  />
                </Box>

                <IconButton
                  color="primary"
                  onClick={() => setCustomerDialogOpen(true)}
                >
                  <AddIcon />
                </IconButton>
              </Stack>

              {/* Dados do cliente */}
              <Stack spacing={1}>
                <TextField
                  label="Email"
                  value={form.customerEmail}
                  onChange={(e) =>
                    handleChangeField("customerEmail", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={form.customerPhone}
                  onChange={(e) =>
                    handleChangeField("customerPhone", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Address"
                  value={form.customerAddress}
                  onChange={(e) =>
                    handleChangeField("customerAddress", e.target.value)
                  }
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Stack>

              {/* Seção de itens: adicionar de serviços/produtos */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Items
                </Typography>

                <Stack
                  direction={isXs ? "column" : "row"}
                  spacing={2}
                  sx={{ mb: 1 }}
                >
                  <Autocomplete
                    size="small"
                    options={services}
                    getOptionLabel={(option) => option.name || ""}
                    onChange={(_, value) =>
                      value && handleAddItemFromRef(value, "service")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Add service"
                        placeholder="Search service..."
                      />
                    )}
                    fullWidth
                  />

                  <Autocomplete
                    size="small"
                    options={products}
                    getOptionLabel={(option) => option.name || ""}
                    onChange={(_, value) =>
                      value && handleAddItemFromRef(value, "product")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Add product"
                        placeholder="Search product..."
                      />
                    )}
                    fullWidth
                  />
                </Stack>

                <EstimateItemsTable
                  items={items}
                  onChangeItem={handleChangeItem}
                  onRemoveItem={handleRemoveItem}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    Total: ${calcTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Observação */}
              <TextField
                label="Notes"
                value={form.notes}
                onChange={(e) =>
                  handleChangeField("notes", e.target.value)
                }
                size="small"
                fullWidth
                multiline
                minRows={2}
              />

              {error && (
                <Typography
                  variant="caption"
                  sx={{ color: "error.main" }}
                >
                  {error}
                </Typography>
              )}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="estimate-form"
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de novo cliente reaproveitando CustomerFormDialog */}
      <CustomerFormDialog
        open={customerDialogOpen}
        onClose={() => setCustomerDialogOpen(false)}
        onSaved={handleCustomerCreated}
        initialData={null}
      />
    </>
  );
}