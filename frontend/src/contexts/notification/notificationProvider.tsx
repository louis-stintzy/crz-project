import { useState, type ReactNode } from "react";
import type {
  Notification,
  NotificationSeverity,
} from "../../types/notification.types";
import { NotificationContext } from "./notificationContext";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showMessage = (message: string, severity: NotificationSeverity) => {
    setNotification({ message, severity });
  };

  const clearMessage = () => {
    setNotification(null);
  };

  return (
    <NotificationContext
      value={{
        notification,
        showMessage,
        clearMessage,
      }}
    >
      {children}
    </NotificationContext>
  );
}
