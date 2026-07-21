import { useEffect, useState, type ReactNode } from "react";
import type {
  AppUserPublic,
  UpdateAppUserInput,
} from "../../types/appUser.types";
import { appUserService } from "../../services/appUser.service";
import { AuthContext } from "./authContext";
import { authService } from "../../services/auth.service";
import type { LoginInput, RegisterInput } from "../../types/auth.types";

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

  const register = async (data: RegisterInput) => {
    await authService.register(data);
    setCurrentUser(null);
  };

  const login = async (data: LoginInput) => {
    const user: AppUserPublic = await authService.login(data);
    setCurrentUser(user);
  };

  const updateProfile = async (data: UpdateAppUserInput) => {
    const updatedUser: AppUserPublic = await appUserService.updateMe(data);
    setCurrentUser(updatedUser);
  };

  const deleteAccount = async () => {
    await appUserService.deleteMe();
    setCurrentUser(null);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      // note: Regardless of whether the logout request succeeds or fails, we clear the current user state to ensure the user is logged out on the client side.
      setCurrentUser(null);
    }
  };

  const handleUnauthorized = (action: "login" | "update" | "delete") => {
    console.log(`Unauthorized action : ${action}`);
    setCurrentUser(null);
  };

  return (
    <AuthContext
      value={{
        currentUser,
        isLoadingAuth,
        register,
        login,
        updateProfile,
        deleteAccount,
        logout,
        handleUnauthorized,
      }}
    >
      {children}
    </AuthContext>
  );
}
