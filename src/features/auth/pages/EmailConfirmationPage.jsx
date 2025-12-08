// src/features/auth/pages/EmailConfirmationPage.jsx
import { AuthLayout } from "../../../components/layout/AuthLayout";
import { EmailConfirmationForm } from "../components/EmailConfirmationForm";

export function EmailConfirmationPage() {
  return (
    <AuthLayout>
      <EmailConfirmationForm />
    </AuthLayout>
  );
}