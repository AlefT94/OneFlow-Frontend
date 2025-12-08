import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Stack,
} from "@mui/material";
import { useAuthContext } from "../../../App/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setApiError("Please fill in email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(form.email, form.password); // AuthProvider mock
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setApiError("Error signing in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Stack spacing={1} mb={1}>
        <Typography variant="h6">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Access your company dashboard.
        </Typography>
      </Stack>

      {apiError && (
        <Alert severity="error" variant="outlined">
          {apiError}
        </Alert>
      )}

      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        required
        size="small"
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth
        required
        size="small"
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={submitting}
        sx={{ mt: 1 }}
      >
        {submitting ? "Signing in..." : "Sign in"}
      </Button>
    </Box>
  );
}