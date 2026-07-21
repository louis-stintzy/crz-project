import { useState } from "react";
import { useAuth } from "../../contexts/auth/useAuth";
import { useNotification } from "../../contexts/notification/useNotification";

interface LogoutButtonProps {
  onLogout: () => void;
}

function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { logout } = useAuth();
  const { showMessage } = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      showMessage("You are logged out.");
    } catch (error) {
      console.error(error);
      showMessage(
        "You are not properly logged out. Please log in again and then log out.",
      );
    } finally {
      onLogout();
      setIsLoading(false);
    }
  };
  return (
    <button type="button" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}

export default LogoutButton;
