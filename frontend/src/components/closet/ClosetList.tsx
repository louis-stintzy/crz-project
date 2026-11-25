import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { closetService } from "../../services/closet.service";
import type { ClosetEntity } from "../../types/closetEntity.types";
import CreateClosetDialog from "./CreateClosetDialog";
import DeleteClosetDialog from "./DeleteClosetDialog";
import EditClosetDialog from "./EditClosetDialog";

function ClosetList() {
  const [closets, setClosets] = useState<ClosetEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [closetToEdit, setClosetToEdit] = useState<ClosetEntity | null>(null);
  const [closetToDelete, setClosetToDelete] = useState<ClosetEntity | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const fetchClosets = async () => {
      try {
        const data = await closetService.getAll();
        if (isMounted) setClosets(data);
      } catch (error) {
        const isUnauthorized =
          axios.isAxiosError(error) && error.response?.status === 401;
        if (isMounted && !isUnauthorized) {
          setErrorMessage(
            "Unable to load your closets. Please try again later.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchClosets();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClosetCreated = (closet: ClosetEntity) => {
    setClosets((currentClosets) => [closet, ...currentClosets]);
    setErrorMessage(null);
    setIsCreateDialogOpen(false);
  };

  const handleClosetUpdated = (updatedCloset: ClosetEntity) => {
    setClosets((currentClosets) =>
      currentClosets.map((closet) =>
        closet.id === updatedCloset.id ? updatedCloset : closet,
      ),
    );
    setClosetToEdit(null);
  };

  const handleClosetDeleted = (closetId: string) => {
    setClosets((currentClosets) =>
      currentClosets.filter((closet) => closet.id !== closetId),
    );
    setClosetToDelete(null);
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            Your closets
          </Typography>
          <Typography color="text.secondary">
            Find the wardrobes linked to your account.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={isLoading}
        >
          Add closet
        </Button>
      </Stack>

      {isLoading ? (
        <Box
          role="status"
          aria-label="Loading closets"
          sx={{ display: "flex", justifyContent: "center", py: 6 }}
        >
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Paper
          role="alert"
          elevation={0}
          sx={{ border: 1, borderColor: "error.light", p: 3 }}
        >
          <Typography color="error.main">{errorMessage}</Typography>
        </Paper>
      ) : closets.length === 0 ? (
        <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 3 }}>
          <Typography variant="h6">No closets yet</Typography>
          <Typography color="text.secondary">
            Your closets will appear here once you create one.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {closets.map((closet) => (
            <Paper
              component="article"
              key={closet.id}
              elevation={0}
              sx={{ border: 1, borderColor: "divider", p: { xs: 2.5, sm: 3 } }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  alignItems: { xs: "stretch", sm: "flex-start" },
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    component="h2"
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    {closet.name}
                  </Typography>
                  <Typography color="text.secondary">
                    {closet.description ?? "No description provided."}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => setClosetToEdit(closet)}
                    aria-label={`Edit ${closet.name}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setClosetToDelete(closet)}
                    aria-label={`Delete ${closet.name}`}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <CreateClosetDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onClosetCreated={handleClosetCreated}
      />

      {closetToEdit && (
        <EditClosetDialog
          closet={closetToEdit}
          onClose={() => setClosetToEdit(null)}
          onClosetUpdated={handleClosetUpdated}
        />
      )}

      {closetToDelete && (
        <DeleteClosetDialog
          closet={closetToDelete}
          onClose={() => setClosetToDelete(null)}
          onClosetDeleted={handleClosetDeleted}
        />
      )}
    </Stack>
  );
}

export default ClosetList;
