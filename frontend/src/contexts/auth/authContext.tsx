import { createContext } from "react";
import type { AppUserPublic } from "../../types/appUser.types";

interface AuthContextValue {
  currentUser: AppUserPublic | null;
  isLoadingAuth: boolean;
  setCurrentUser: (user: AppUserPublic | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
