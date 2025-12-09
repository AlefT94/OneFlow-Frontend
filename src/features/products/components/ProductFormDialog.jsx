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
  createProduct,
  updateProduct,
} from "../api/productsApi";

export function ProductFormDialog({
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
    unit: "",
    price: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        unit: initialData.unit || "",
        price: String(initialData.price ?? ""),
        notes: initialData.notes || "",
      });
    } else {
      setForm({
        name: "",
        unit: "",
        price: "",
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
    if (!form.name || !form.unit || !form.price) {
      return "Name, unit of measure and price are required.";
    }
    if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0) {
      return "Price must be a positive number.";
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
        unit: form.unit.trim(),
        price: Number(form.price),
        notes: form.notes.trim(),
      };

      let saved;
      if (isEdit) {
        saved = await updateProduct(initialData.id, payload);
      } else {
        saved = await createProduct(payload);
      }

      onSaved(saved, isEdit);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error saving product. Please try again.");
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
      fullScreen={isXs} // no mobile ocupa a tela toda
    >
      <DialogTitle>
        {isEdit ? "Edit product" : "New product"}
      </DialogTitle>
      <DialogContent>
        <form id="product-form" onSubmit={handleSubmit}>
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
              label="Unit of measure"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              placeholder="e.g. L, mL, kg, unit"
            />

            <TextField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
              size="small"
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
          form="product-form"
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}