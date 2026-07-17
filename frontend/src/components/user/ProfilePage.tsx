import { useEffect, useState, type FormEvent } from "react";
import type {
  AppUserPublic,
  UpdateAppUserInput,
} from "../../types/appUser.types";
import { appUserService } from "../../services/appUser.service";
import axios from "axios";
import DeleteAccountButton from "./DeleteAccountButton";
import Modal from "../Modal";
import DeleteAccountConfirmation from "./DeleteAccountConfirmation";

interface ProfilePageProps {
  currentUser: AppUserPublic;
  onUpdateProfile: (updatedUser: AppUserPublic) => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
}

function ProfilePage({
  currentUser,
  onUpdateProfile,
  onDeleteAccount,
  onLogout,
}: ProfilePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState(currentUser.pseudo);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [pictureUrl, setPictureUrl] = useState(currentUser.pictureUrl || "");

  useEffect(() => {
    setPseudo(currentUser.pseudo);
    setEmail(currentUser.email);
    setPassword("");
    setPictureUrl(currentUser.pictureUrl || "");
  }, [currentUser]);

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setMessage("Updating profile...");
      const data: UpdateAppUserInput = {
        pseudo,
        email,
        pictureUrl: pictureUrl.trim() === "" ? null : pictureUrl.trim(),
      };
      if (password.trim() !== "") data.password = password.trim();
      const updatedUser: AppUserPublic = await appUserService.updateMe(data);
      onUpdateProfile(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setMessage("The profile information is invalid.");
      } else if (axios.isAxiosError(error) && error.response?.status === 401) {
        onLogout();
      } else if (axios.isAxiosError(error) && error.response?.status === 409) {
        setMessage(
          `This account cannot be updated with this information. Please try using a different email address or username.`,
        );
      } else {
        setMessage("Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h1>ProfilePage</h1>
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
          Update Profile
        </button>
      </form>
      <DeleteAccountButton
        isLoading={isLoading}
        onOpenModal={() => setIsModalOpen(true)}
      />
      <Modal
        isOpen={isModalOpen}
        title="Delete account confirmation"
        onClose={() => setIsModalOpen(false)}
      >
        <DeleteAccountConfirmation
          onDeleteAccount={onDeleteAccount}
          onLogout={onLogout}
        />
      </Modal>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfilePage;
