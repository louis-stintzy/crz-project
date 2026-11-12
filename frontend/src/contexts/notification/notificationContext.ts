import { createContext } from "react";
import type {
  Notification,
  NotificationSeverity,
} from "../../types/notification.types";

interface NotificationContextValue {
  notification: Notification | null;
  showMessage: (message: string, severity: NotificationSeverity) => void;
  clearMessage: () => void;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
