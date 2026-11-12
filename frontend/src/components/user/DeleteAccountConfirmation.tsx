import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuth } from "../../contexts/auth/useAuth";

interface DeleteAccountConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteAccount: () => void;
}

function DeleteAccountConfirmation({
  isOpen,
  onClose,
  onDeleteAccount,
}: DeleteAccountConfirmationProps) {
  const { deleteAccount } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteAccount();
      onDeleteAccount();
    } catch {
      // note: Error message is handled by AuthProvider.
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="delete-account-dialog-title"
      aria-describedby="delete-account-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="delete-account-dialog-title">
        Delete account permanently?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-account-dialog-description">
          Your profile and account data will be permanently deleted. This
          action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDeleteAccount}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Delete account"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteAccountConfirmation;
