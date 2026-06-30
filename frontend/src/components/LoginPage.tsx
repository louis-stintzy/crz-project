import { useState } from "react";
import type { AppUserPublic } from "../types/appUser.types";
import { authService } from "../services/auth.service";
import type { LoginInput } from "../types/auth.types";

interface LoginPageProps {
  onLogin: (user: AppUserPublic) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMessage("Logging in...");
      const data: LoginInput = {
        email,
        password,
      };
      const user: AppUserPublic = await authService.login(data);
      onLogin(user);
      setMessage(null);
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Invalid credentials or server error.");
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
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginPage;
