import { useState } from "react";
import { useAuth } from "../../contexts/auth/useAuth";

interface LogoutButtonProps {
  onLogout: () => void;
}

function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { logout } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error(error);
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
