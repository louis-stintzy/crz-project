import { useEffect, useState } from "react";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { closetService } from "../../services/closet.service";
import type { ClosetEntity } from "../../types/closetEntity.types";

function ClosetList() {
  const [closets, setClosets] = useState<ClosetEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchClosets = async () => {
      try {
        const data = await closetService.getAll();
        if (isMounted) setClosets(data);
      } catch {
        if (isMounted) {
          setErrorMessage("Unable to load your closets. Please try again later.");
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

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          Your closets
        </Typography>
        <Typography color="text.secondary">
          Find the wardrobes linked to your account.
        </Typography>
      </Box>

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
        <Paper
          elevation={0}
          sx={{ border: 1, borderColor: "divider", p: 3 }}
        >
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
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
                {closet.name}
              </Typography>
              <Typography color="text.secondary">
                {closet.description ?? "No description provided."}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default ClosetList;
