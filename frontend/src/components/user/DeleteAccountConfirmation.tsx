import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/auth/useAuth";

interface DeleteAccountConfirmationProps {
  onDeleteAccount: () => void;
  onUnauthorizedError: () => void;
  onServerError: (message: string) => void;
}

function DeleteAccountConfirmation({
  onDeleteAccount,
  onUnauthorizedError,
  onServerError,
}: DeleteAccountConfirmationProps) {
  const { deleteAccount, handleUnauthorized } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteAccount();
      onDeleteAccount();
    } catch (error) {
      console.error("Delete account failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleUnauthorized("delete");
        onUnauthorizedError();
        return;
      }
      onServerError("An unexpected error occurred while deleting the account.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <p>
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>
      <button type="button" onClick={handleDeleteAccount} disabled={isLoading}>
        {isLoading ? "Deleting account..." : "Delete my account"}
      </button>
    </div>
  );
}

export default DeleteAccountConfirmation;
