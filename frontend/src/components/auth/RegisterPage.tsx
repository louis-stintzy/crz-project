import { useState, type FormEvent } from "react";
import type { RegisterInput } from "../../types/auth.types";
import { useAuth } from "../../contexts/auth/useAuth";

interface RegisterPageProps {
  onHideRegisterPage: () => void;
  onRegisterSuccess: () => void;
}

function RegisterPage({
  onHideRegisterPage,
  onRegisterSuccess,
}: RegisterPageProps) {
  const { register } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data: RegisterInput = {
        pseudo,
        email,
        password,
        pictureUrl: pictureUrl.trim() === "" ? null : pictureUrl.trim(),
      };
      await register(data);
      setPseudo("");
      setEmail("");
      setPassword("");
      setPictureUrl("");
      onRegisterSuccess();
    } catch {
      // note: Error message is handled by AuthProvider.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={handleRegister}>
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
              required
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
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>
      <button type="button" onClick={onHideRegisterPage} disabled={isLoading}>
        Back
      </button>
    </div>
  );
}

export default RegisterPage;
