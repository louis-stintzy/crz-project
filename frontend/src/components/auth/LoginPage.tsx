import { useState, type FormEvent } from "react";
import type { LoginInput } from "../../types/auth.types";
import axios from "axios";
import { useAuth } from "../../contexts/auth/useAuth";
import { useNotification } from "../../contexts/notification/useNotification";

interface LoginPageProps {
  onShowRegisterPage: () => void;
  onLoginSuccess: () => void;
  onUnauthorizedError: () => void;
}

function LoginPage({
  onShowRegisterPage,
  onLoginSuccess,
  onUnauthorizedError,
}: LoginPageProps) {
  const { login, handleUnauthorized } = useAuth();
  const { showMessage, clearMessage } = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data: LoginInput = {
        email,
        password,
      };
      await login(data);
      setEmail("");
      setPassword("");
      clearMessage();
      onLoginSuccess();
    } catch (error) {
      console.error("Login failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleUnauthorized("login");
        showMessage("Invalid credentials. Please try again.");
        onUnauthorizedError();
        return;
      }
      showMessage("An unexpected error occurred while logging in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
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
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button type="button" onClick={onShowRegisterPage} disabled={isLoading}>
        Create an account
      </button>
    </div>
  );
}

export default LoginPage;
