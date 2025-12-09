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
} from "@mui/material";
import {
  createCustomer,
  updateCustomer,
} from "../api/customersApi";

export function CustomerFormDialog({
  open,
  onClose,
  onSaved,
  initialData,
}) {
  const isEdit = Boolean(initialData?.id);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        notes: initialData.notes || "",
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });
    }
    setError(null);
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const validate = () => {
    if (!form.name) {
      return "Name is required.";
    }
    // E-mail opcional, mas se preenchido, faz uma validação simples
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      return "Please enter a valid email.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
      };

      let saved;
      if (isEdit) {
        saved = await updateCustomer(initialData.id, payload);
      } else {
        saved = await createCustomer(payload);
      }

      onSaved(saved, isEdit);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error saving customer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
      fullScreen={isXs} // no mobile ocupa tela toda
    >
      <DialogTitle>
        {isEdit ? "Edit customer" : "New customer"}
      </DialogTitle>
      <DialogContent>
        <form id="customer-form" onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />

            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              size="small"
              multiline
              minRows={2}
            />

            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              fullWidth
              size="small"
              multiline
              minRows={2}
            />

            {error && (
              <span style={{ color: "#b91c1c", fontSize: 13 }}>
                {error}
              </span>
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
          form="customer-form"
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}