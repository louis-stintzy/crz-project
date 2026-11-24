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
  CreateClosetInput,
} from "../../types/closetEntity.types";

interface CreateClosetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClosetCreated: (closet: ClosetEntity) => void;
}

function CreateClosetDialog({
  isOpen,
  onClose,
  onClosetCreated,
}: CreateClosetDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setErrorMessage(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
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
    const data: CreateClosetInput = {
      name: trimmedName,
      description: trimmedDescription === "" ? null : trimmedDescription,
    };

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const createdCloset = await closetService.create(data);
      resetForm();
      onClosetCreated(createdCloset);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return;
      } else if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage("A closet with this name already exists.");
      } else {
        setErrorMessage("Unable to create the closet. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="create-closet-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="create-closet-dialog-title">Create a closet</DialogTitle>
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
              "Create closet"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CreateClosetDialog;
