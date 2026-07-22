import { useState } from "react";
import { useAuth } from "../../contexts/auth/useAuth";

interface DeleteAccountConfirmationProps {
  onDeleteAccount: () => void;
}

function DeleteAccountConfirmation({
  onDeleteAccount,
}: DeleteAccountConfirmationProps) {
  const { deleteAccount } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteAccount();
      onDeleteAccount();
    } catch {
      // note: Error message is handled by AuthProvider.
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
