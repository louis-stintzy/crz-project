import { createContext } from "react";
import type {
  AppUserPublic,
  UpdateAppUserInput,
} from "../../types/appUser.types";
import type { LoginInput, RegisterInput } from "../../types/auth.types";

interface AuthContextValue {
  currentUser: AppUserPublic | null;
  isLoadingAuth: boolean;
  register: (data: RegisterInput) => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  updateProfile: (data: UpdateAppUserInput) => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
