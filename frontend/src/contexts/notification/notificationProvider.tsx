import { useCallback, useState, type ReactNode } from "react";
import type {
  Notification,
  NotificationSeverity,
} from "../../types/notification.types";
import { NotificationContext } from "./notificationContext";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  // doit rester stable, utilisé par l'intercepteur axios
  const showMessage = useCallback(
    (message: string, severity: NotificationSeverity) => {
      setNotification({ message, severity });
    },
    [],
  );

  const clearMessage = useCallback(() => {
    setNotification(null);
  }, []);

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
