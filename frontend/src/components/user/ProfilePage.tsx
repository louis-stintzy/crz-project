import { useEffect, useState } from "react";
import type { AppUserPublic } from "../../types/appUser.types";
import { appUserService } from "../../services/appUser.service";
import { AxiosError } from "axios";

interface ProfilePageProps {
  currentUser: AppUserPublic;
  onUpdateProfile: (updatedUser: AppUserPublic) => void;
}

function ProfilePage({ currentUser, onUpdateProfile }: ProfilePageProps) {
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      setIsLoading(true);
      setMessage("Updating profile...");
      const data = {
        pseudo,
        email,
        password: password.trim() === "" ? undefined : password.trim(),
        pictureUrl: pictureUrl.trim() === "" ? null : pictureUrl.trim(),
      };
      const updatedUser: AppUserPublic = await appUserService.updateMe(data);
      onUpdateProfile(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof AxiosError && error.response?.status === 409) {
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfilePage;
