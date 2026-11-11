import { useState, type FormEvent } from "react";
import { Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import type { LoginInput } from "../../types/auth.types";
import { useAuth } from "../../contexts/auth/useAuth";
import { useNotification } from "../../contexts/notification/useNotification";
import AuthLayout from "./AuthLayout";

interface LoginPageProps {
  onShowRegisterPage: () => void;
  onLoginSuccess: () => void;
  onLoginFailure: () => void;
}

function LoginPage({
  onShowRegisterPage,
  onLoginSuccess,
  onLoginFailure,
}: LoginPageProps) {
  const { login } = useAuth();
  const { clearMessage } = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data: LoginInput = { email, password };
      await login(data);
      setEmail("");
      setPassword("");
      clearMessage();
      onLoginSuccess();
    } catch {
      // Error message is handled by AuthProvider.
      onLoginFailure();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your wardrobe.">
      <Stack component="form" spacing={2.5} onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" variant="contained" size="large" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
        </Button>
      </Stack>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Don't have an account?{" "}
        <Button variant="text" onClick={onShowRegisterPage} disabled={isLoading}>
          Create an account
        </Button>
      </Typography>
    </AuthLayout>
  );
}

export default LoginPage;
