// src/features/auth/components/EmailConfirmationForm.jsx
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export function EmailConfirmationForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase(); // se quiser forçar maiúsculas
    // limitar a 5 caracteres
    if (value.length <= 5) {
      setCode(value);
      setApiError(null);
    }
  };

  const validate = () => {
    if (!code || code.length !== 5) {
      return "Please enter the 5-character verification code.";
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

      // TODO: chamar API para validar o código
      // await authApi.confirmEmail({ email, code });

      // mock: aceita qualquer código de 5 chars
      // após confirmação, redireciona para login
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setApiError("Invalid or expired code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
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
        <Typography variant="h6">Verify your email</Typography>
        <Typography variant="body2" color="text.secondary">
          We have sent a 5-character verification code to{" "}
          <strong>{email || "your email"}</strong>. Enter it below to
          complete your registration.
        </Typography>
      </Stack>

      {apiError && (
        <Alert severity="error" variant="outlined">
          {apiError}
        </Alert>
      )}

      <TextField
        label="Verification code"
        name="code"
        value={code}
        onChange={handleChange}
        fullWidth
        required
        size="small"
        inputProps={{
          maxLength: 5,
          style: { letterSpacing: "0.3em", textTransform: "uppercase" },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={submitting}
        sx={{ mt: 1 }}
      >
        {submitting ? "Verifying..." : "Verify email"}
      </Button>

      <Button
        type="button"
        variant="text"
        fullWidth
        onClick={handleBackToLogin}
      >
        Back to sign in
      </Button>
    </Box>
  );
}