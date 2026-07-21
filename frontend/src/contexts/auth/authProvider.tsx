import { useEffect, useState, type ReactNode } from "react";
import type { AppUserPublic } from "../../types/appUser.types";
import { appUserService } from "../../services/appUser.service";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUserPublic | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user: AppUserPublic = await appUserService.getMe();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext
      value={{
        currentUser,
        isLoadingAuth,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext>
  );
}
