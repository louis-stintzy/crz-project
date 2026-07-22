import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./index.css";
import { AuthProvider } from "./contexts/auth/authProvider";
import { NotificationProvider } from "./contexts/notification/notificationProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NotificationProvider>
  </StrictMode>,
);
