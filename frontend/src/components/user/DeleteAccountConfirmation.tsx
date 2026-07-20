import { useState } from "react";
import { appUserService } from "../../services/appUser.service";
import axios from "axios";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await appUserService.deleteMe();
      onDeleteAccount();
    } catch (error) {
      console.error("Delete account failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
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
