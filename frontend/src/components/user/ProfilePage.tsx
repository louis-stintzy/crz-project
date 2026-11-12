import { useEffect, useState, type FormEvent } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  AppUserPublic,
  UpdateAppUserInput,
} from "../../types/appUser.types";
import DeleteAccountButton from "./DeleteAccountButton";
import DeleteAccountConfirmation from "./DeleteAccountConfirmation";
import { useAuth } from "../../contexts/auth/useAuth";

interface ProfilePageProps {
  currentUser: AppUserPublic;
  onHideProfilePage: () => void;
  onDeleteAccount: () => void;
}

function ProfilePage({
  currentUser,
  onHideProfilePage,
  onDeleteAccount,
}: ProfilePageProps) {
  const { updateProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pseudo, setPseudo] = useState(currentUser.pseudo);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [pictureUrl, setPictureUrl] = useState(currentUser.pictureUrl ?? "");

  useEffect(() => {
    setPseudo(currentUser.pseudo);
    setEmail(currentUser.email);
    setPassword("");
    setPictureUrl(currentUser.pictureUrl ?? "");
  }, [currentUser]);

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data: UpdateAppUserInput = {
        pseudo,
        email,
        pictureUrl: pictureUrl.trim() === "" ? null : pictureUrl.trim(),
      };
      if (password.trim() !== "") data.password = password.trim();
      await updateProfile(data);
      setPassword("");
    } catch {
      // note: Error message is handled by AuthProvider.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", py: { xs: 1, sm: 4 } }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 720,
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
        }}
      >
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
          >
            <Avatar
              src={currentUser.pictureUrl ?? undefined}
              alt={`${currentUser.pseudo}'s profile picture`}
              sx={{
                width: 72,
                height: 72,
                bgcolor: "primary.main",
                fontSize: 30,
              }}
            >
              {currentUser.pseudo.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                Your profile
              </Typography>
              <Typography color="text.secondary">
                Update your account information and profile picture.
              </Typography>
            </Box>
          </Stack>

          <Stack component="form" spacing={2.5} onSubmit={handleUpdateProfile}>
            <TextField
              label="Username"
              required
              fullWidth
              autoComplete="username"
              slotProps={{ htmlInput: { minLength: 3 } }}
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
              label="New password (optional)"
              type="password"
              fullWidth
              autoComplete="new-password"
              helperText="Leave empty to keep your current password."
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

            <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={2}>
              <Button
                type="button"
                variant="outlined"
                onClick={onHideProfilePage}
                disabled={isLoading}
                sx={{ flex: 1 }}
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ flex: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update profile"
                )}
              </Button>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Delete account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Permanently remove your account and its data.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <DeleteAccountButton
                isLoading={isLoading}
                onOpenModal={() => setIsModalOpen(true)}
              />
            </Box>
          </Stack>
        </Stack>
      </Paper>

      <DeleteAccountConfirmation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeleteAccount={onDeleteAccount}
      />
    </Box>
  );
}

export default ProfilePage;
