import { useState, type FormEvent } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { closetService } from "../../services/closet.service";
import type {
  ClosetEntity,
  UpdateClosetInput,
} from "../../types/closetEntity.types";

interface EditClosetDialogProps {
  closet: ClosetEntity;
  onClose: () => void;
  onClosetUpdated: (closet: ClosetEntity) => void;
}

function EditClosetDialog({
  closet,
  onClose,
  onClosetUpdated,
}: EditClosetDialogProps) {
  const [name, setName] = useState(closet.name);
  const [description, setDescription] = useState(closet.description ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const trimmedName = name.trim();
    if (trimmedName === "") {
      setErrorMessage("Closet name is required.");
      return;
    }

    const trimmedDescription = description.trim();
    const data: UpdateClosetInput = {
      name: trimmedName,
      description: trimmedDescription === "" ? null : trimmedDescription,
    };

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const updatedCloset = await closetService.updateById(closet.id, data);
      setIsLoading(false);
      onClosetUpdated(updatedCloset);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setErrorMessage("The closet information is invalid.");
      } else if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorMessage("This closet no longer exists.");
      } else if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage("A closet with this name already exists.");
      } else {
        setErrorMessage("Unable to update the closet. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="edit-closet-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="edit-closet-dialog-title">Edit closet</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2.5}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField
              label="Name"
              required
              fullWidth
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
            <TextField
              label="Description (optional)"
              fullWidth
              multiline
              minRows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isLoading}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button type="button" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default EditClosetDialog;
