import type { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        minHeight: { md: 600 },
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <Stack
        justifyContent="space-between"
        sx={{
          display: { xs: "none", md: "flex" },
          position: "relative",
          overflow: "hidden",
          p: 5,
          color: "common.white",
          background: "linear-gradient(145deg, #304D3C, #66846D)",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Closet Manager
        </Typography>

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Your wardrobe,
            <br />
            your way.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Keep your clothes organized and build outfits you love.
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          A little more space for your style.
        </Typography>
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: "12%",
            right: "-20%",
            width: 340,
            height: 340,
            borderRadius: "50%",
            border: "75px solid rgba(255,255,255,0.08)",
          }}
        />
      </Stack>

      <Stack
        spacing={3}
        justifyContent="center"
        sx={{ p: { xs: 3, sm: 5, md: 6 } }}
      >
        <Box>
          <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          <Typography color="text.secondary">{subtitle}</Typography>
        </Box>
        {children}
      </Stack>
    </Paper>
  );
}

export default AuthLayout;
