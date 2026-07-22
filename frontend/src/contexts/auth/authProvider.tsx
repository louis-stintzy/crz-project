import { useEffect, useState, type ReactNode } from "react";
import type {
  AppUserPublic,
  UpdateAppUserInput,
} from "../../types/appUser.types";
import { appUserService } from "../../services/appUser.service";
import { AuthContext } from "./authContext";
import { authService } from "../../services/auth.service";
import type { LoginInput, RegisterInput } from "../../types/auth.types";
import axios from "axios";
import { useNotification } from "../notification/useNotification";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showMessage, clearMessage } = useNotification();

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

  // ----- Register -----
  const register = async (data: RegisterInput) => {
    try {
      await authService.register(data);
      setCurrentUser(null);
      showMessage("Account created successfully. You can now log in.");
    } catch (error) {
      console.error("Register failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        showMessage("The account information is invalid.");
        throw error;
      }
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showMessage(
          `This account cannot be created with this information. Please try using a different email address or username.`,
        );
        throw error;
      }
      showMessage("An unexpected error occurred while registering.");
      throw error;
    }
  };

  // ----- Login -----
  const login = async (data: LoginInput) => {
    try {
      const user: AppUserPublic = await authService.login(data);
      setCurrentUser(user);
      clearMessage();
    } catch (error) {
      console.error("Login failed:", error);
      setCurrentUser(null);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showMessage("Invalid credentials. Please try again.");
        throw error;
      }
      showMessage("An unexpected error occurred while logging in.");
      throw error;
    }
  };

  // ------ Update Profile -----
  const updateProfile = async (data: UpdateAppUserInput) => {
    try {
      const updatedUser: AppUserPublic = await appUserService.updateMe(data);
      setCurrentUser(updatedUser);
      showMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        showMessage("The profile information is invalid.");
        throw error;
      }
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 404)
      ) {
        setCurrentUser(null);
        showMessage(
          `Your session has expired. Your profile has not been updated. Please log in again.`,
        );
        throw error;
      }
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showMessage(
          `This account cannot be updated with this information. Please try using a different email address or username.`,
        );
        throw error;
      }
      showMessage("An unexpected error occurred while updating the profile.");
      throw error;
    }
  };
  // ------ Delete Account -----
  const deleteAccount = async () => {
    try {
      await appUserService.deleteMe();
      setCurrentUser(null);
      showMessage("Your account has been deleted successfully.");
    } catch (error) {
      console.error("Delete account failed:", error);
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 404)
      ) {
        setCurrentUser(null);
        showMessage(
          `Your session has expired. Your account was not deleted. Please log in again.`,
        );
        throw error;
      }
      showMessage("An unexpected error occurred while deleting the account.");
      throw error;
    }
  };

  // ----- Logout -----
  const logout = async () => {
    try {
      await authService.logout();
      showMessage("You are logged out.");
    } catch (error) {
      console.error(error);
      showMessage(
        "You are not properly logged out. Please log in again and then log out.",
      );
    } finally {
      // note: Regardless of whether the logout request succeeds or fails, we clear the current user state to ensure the user is logged out on the client side.
      setCurrentUser(null);
    }
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
      }}
    >
      {children}
    </AuthContext>
  );
}
