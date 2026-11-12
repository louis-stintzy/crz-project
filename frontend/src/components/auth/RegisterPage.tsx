import { useState, type FormEvent } from "react";
import { Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import type { RegisterInput } from "../../types/auth.types";
import { useAuth } from "../../contexts/auth/useAuth";
import AuthLayout from "./AuthLayout";

interface RegisterPageProps {
  onHideRegisterPage: () => void;
  onRegisterSuccess: () => void;
}

function RegisterPage({
  onHideRegisterPage,
  onRegisterSuccess,
}: RegisterPageProps) {
  const { register } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data: RegisterInput = {
        pseudo,
        email,
        password,
        pictureUrl: pictureUrl.trim() === "" ? null : pictureUrl.trim(),
      };
      await register(data);
      setPseudo("");
      setEmail("");
      setPassword("");
      setPictureUrl("");
      onRegisterSuccess();
    } catch {
      // Error message is handled by AuthProvider.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start organizing your wardrobe.">
      <Stack component="form" spacing={2} onSubmit={handleRegister}>
        <TextField
          label="Username"
          required
          fullWidth
          autoComplete="username"
          slotProps={{ htmlInput: { minLength: 3, maxLength: 255 } }}
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          disabled={isLoading}
        />
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          autoComplete="new-password"
          slotProps={{ htmlInput: { minLength: 8 } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <TextField
          label="Profile picture URL (optional)"
          type="url"
          fullWidth
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" variant="contained" size="large" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create account"}
        </Button>
      </Stack>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Already have an account?{" "}
        <Button variant="text" onClick={onHideRegisterPage} disabled={isLoading}>
          Sign in
        </Button>
      </Typography>
    </AuthLayout>
  );
}

export default RegisterPage;
