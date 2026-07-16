import { useState, type FormEvent } from "react";
import type { RegisterInput } from "../../types/auth.types";
import type { AppUserPublic } from "../../types/appUser.types";
import { authService } from "../../services/auth.service";
import { AxiosError } from "axios";

function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [createdUser, setCreatedUser] = useState<AppUserPublic | null>(null);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setMessage("Creating account...");
      const data: RegisterInput = {
        pseudo,
        email,
        password,
        pictureUrl: pictureUrl.trim() === "" ? null : pictureUrl.trim(),
      };
      const user: AppUserPublic = await authService.register(data);
      setCreatedUser(user);
      setMessage("Account created successfully. You can now log in.");
      setPseudo("");
      setEmail("");
      setPassword("");
      setPictureUrl("");
    } catch (error) {
      console.error("Register failed:", error);
      if (error instanceof AxiosError && error.response?.status === 409) {
        setMessage(
          `This account cannot be created with this information. Please try using a different email address or username.`,
        );
      } else {
        setMessage("Error while creating the account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!createdUser && (
        <>
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
              Register
            </button>
          </form>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterPage;
