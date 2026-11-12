import { Button } from "@mui/material";

interface DeleteAccountButtonProps {
  isLoading: boolean;
  onOpenModal: () => void;
}

function DeleteAccountButton({
  isLoading,
  onOpenModal,
}: DeleteAccountButtonProps) {
  return (
    <Button
      type="button"
      variant="outlined"
      color="error"
      onClick={onOpenModal}
      disabled={isLoading}
    >
      Delete my account
    </Button>
  );
}

export default DeleteAccountButton;
