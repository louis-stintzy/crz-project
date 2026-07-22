import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/auth/useAuth";
import { useNotification } from "../../contexts/notification/useNotification";

interface DeleteAccountConfirmationProps {
  onDeleteAccount: () => void;
  onUnauthorizedError: () => void;
}

function DeleteAccountConfirmation({
  onDeleteAccount,
  onUnauthorizedError,
}: DeleteAccountConfirmationProps) {
  const { deleteAccount, handleUnauthorized } = useAuth();
  const { showMessage } = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteAccount();
      showMessage("Your account has been deleted successfully.");
      onDeleteAccount();
    } catch (error) {
      console.error("Delete account failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleUnauthorized("delete");
        showMessage(
          `Your session has expired. Your account was not deleted. Please log in again.`,
        );
        onUnauthorizedError();
        return;
      }
      showMessage("An unexpected error occurred while deleting the account.");
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
