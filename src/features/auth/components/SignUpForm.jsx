// src/features/auth/components/SignUpForm.jsx
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export function SignUpForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setApiError(null);
  };

  const validate = () => {
    if (!form.companyName || !form.email || !form.password || !form.confirmPassword) {
      return "Please fill in all fields.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setApiError(error);
      return;
    }

    try {
      setSubmitting(true);

      // TODO: call real API to create tenant + admin user
      // Exemplo mock:
      // await authApi.signUp(form);

      // Simular sucesso e redirecionar para tela de confirmação de e-mail
      const params = new URLSearchParams({ email: form.email });
      navigate(`/confirm-email?${params.toString()}`, { replace: true });
    } catch (err) {
      console.error(err);
      setApiError("Error creating account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Stack spacing={1} mb={1}>
        <Typography variant="h6">Create your account</Typography>
        <Typography variant="body2" color="text.secondary">
          Set up your company to start managing services and schedules.
        </Typography>
      </Stack>

      {apiError && (
        <Alert severity="error" variant="outlined">
          {apiError}
        </Alert>
      )}

      <TextField
        label="Company name"
        name="companyName"
        value={form.companyName}
        onChange={handleChange}
        fullWidth
        required
        size="small"
      />

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

      <TextField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
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
        {submitting ? "Creating account..." : "Create account"}
      </Button>

      <Button
        type="button"
        variant="text"
        fullWidth
        onClick={handleGoToLogin}
      >
        Already have an account? Sign in
      </Button>
    </Box>
  );
}