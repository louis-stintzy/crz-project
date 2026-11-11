import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}

export default AppLayout;
