import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { closetService } from "../../services/closet.service";
import type { ClosetEntity } from "../../types/closetEntity.types";

interface DeleteClosetDialogProps {
  closet: ClosetEntity;
  onClose: () => void;
  onClosetDeleted: (closetId: string) => void;
}

function DeleteClosetDialog({
  closet,
  onClose,
  onClosetDeleted,
}: DeleteClosetDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  const handleDelete = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await closetService.deleteById(closet.id);
      onClosetDeleted(closet.id);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return;
      } else if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorMessage("This closet no longer exists.");
      } else {
        setErrorMessage("Unable to delete the closet. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="delete-closet-dialog-title"
      aria-describedby="delete-closet-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="delete-closet-dialog-title">
        Delete closet permanently?
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText id="delete-closet-dialog-description">
            Deleting “{closet.name}” is permanent. All clothing items in this
            closet will also be permanently deleted.
          </DialogContentText>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button type="button" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={isLoading}
          sx={{ minWidth: 140 }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          ) : null}
          Delete closet
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteClosetDialog;
