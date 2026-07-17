import { useState } from "react";
import { appUserService } from "../../services/appUser.service";
import axios from "axios";

interface DeleteAccountConfirmation {
  onDeleteAccount: () => void;
  onLogout: () => void;
}

function DeleteAccountConfirmation({
  onDeleteAccount,
  onLogout,
}: DeleteAccountConfirmation) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      setMessage("Deleting account...");
      await appUserService.deleteMe();
      onDeleteAccount();
    } catch (error) {
      console.error("Delete account failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        onLogout();
      }
      setMessage("An error occurred while deleting the account.");
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
        Delete my account
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DeleteAccountConfirmation;
