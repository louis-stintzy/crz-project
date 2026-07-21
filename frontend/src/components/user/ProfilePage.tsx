import { useEffect, useState, type FormEvent } from "react";
import type {
  AppUserPublic,
  UpdateAppUserInput,
} from "../../types/appUser.types";
import axios from "axios";
import DeleteAccountButton from "./DeleteAccountButton";
import Modal from "../Modal";
import DeleteAccountConfirmation from "./DeleteAccountConfirmation";
import { useAuth } from "../../contexts/auth/useAuth";

interface ProfilePageProps {
  currentUser: AppUserPublic;
  onHideProfilePage: () => void;
  onUpdateProfile: () => void;
  onDeleteAccount: () => void;
  onValidationError: () => void;
  onUnauthorizedError: (action: "update" | "delete") => void;
  onConflictError: () => void;
  onServerError: (message: string) => void;
}

function ProfilePage({
  currentUser,
  onHideProfilePage,
  onUpdateProfile,
  onDeleteAccount,
  onValidationError,
  onUnauthorizedError,
  onConflictError,
  onServerError,
}: ProfilePageProps) {
  const { updateProfile, handleUnauthorized } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pseudo, setPseudo] = useState(currentUser.pseudo);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [pictureUrl, setPictureUrl] = useState(currentUser.pictureUrl ?? "");

  useEffect(() => {
    setPseudo(currentUser.pseudo);
    setEmail(currentUser.email);
    setPassword("");
    setPictureUrl(currentUser.pictureUrl ?? "");
  }, [currentUser]);

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data: UpdateAppUserInput = {
        pseudo,
        email,
        pictureUrl: pictureUrl.trim() === "" ? null : pictureUrl.trim(),
      };
      if (password.trim() !== "") data.password = password.trim();
      await updateProfile(data);
      onUpdateProfile();
      setPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        onValidationError();
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleUnauthorized("update");
        onUnauthorizedError("update");
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        onConflictError();
        return;
      }
      onServerError("An unexpected error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>
            pseudo:
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
              minLength={3}
            />
          </label>
        </div>
        <div>
          <label>
            email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              placeholder="Leave empty to keep current password"
            />
          </label>
        </div>
        <div>
          <label>
            picture url:
            <input
              type="url"
              value={pictureUrl}
              onChange={(e) => setPictureUrl(e.target.value)}
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Updating profile..." : "Update Profile"}
        </button>
      </form>
      <DeleteAccountButton
        isLoading={isLoading}
        onOpenModal={() => setIsModalOpen(true)}
      />
      <button type="button" onClick={onHideProfilePage} disabled={isLoading}>
        Back
      </button>
      <Modal
        isOpen={isModalOpen}
        title="Delete account confirmation"
        onClose={() => setIsModalOpen(false)}
      >
        <DeleteAccountConfirmation
          onDeleteAccount={onDeleteAccount}
          onUnauthorizedError={() => onUnauthorizedError("delete")}
          onServerError={onServerError}
        />
      </Modal>
    </div>
  );
}

export default ProfilePage;
