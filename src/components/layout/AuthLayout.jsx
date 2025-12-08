import { Box, Container, Paper, Typography } from "@mui/material";

export function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              OneFlow
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Service scheduling and billing management for your company.
            </Typography>
          </Box>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}