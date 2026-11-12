export type NotificationSeverity = "success" | "error" | "info";

export interface Notification {
  message: string;
  severity: NotificationSeverity;
}
