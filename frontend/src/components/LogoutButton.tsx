import { useState } from "react";
import { authService } from "../services/auth.service";

interface LogoutButtonProps {
  onLogout: () => void;
}

function LogoutButton({ onLogout }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      onLogout();
      setIsLoading(false);
    }
  };
  return (
    <button type="button" onClick={handleLogout} disabled={isLoading}>
      Logout
    </button>
  );
}

export default LogoutButton;
