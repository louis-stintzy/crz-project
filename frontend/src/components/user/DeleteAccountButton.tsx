interface DeleteAccountButtonProps {
  isLoading: boolean;
  onOpenModal: () => void;
}

function DeleteAccountButton({
  isLoading,
  onOpenModal,
}: DeleteAccountButtonProps) {
  return (
    <button type="button" onClick={onOpenModal} disabled={isLoading}>
      Delete my account
    </button>
  );
}

export default DeleteAccountButton;
