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
import { axiosInstance } from "../../services/axiosInstance";
import { useNotification } from "../notification/useNotification";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showMessage, clearMessage } = useNotification();

  const [currentUser, setCurrentUser] = useState<AppUserPublic | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const requestUrl = axios.isAxiosError(error)
          ? error.config?.url
          : undefined;
        const isPublicAuthRequest =
          requestUrl === "/auth/login" || requestUrl === "/auth/register";

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          currentUser !== null &&
          !isPublicAuthRequest
        ) {
          setCurrentUser(null);
          showMessage(
            "Your session has expired. Please log in again.",
            "error",
          );
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptorId);
    };
  }, [currentUser, showMessage]);

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
      showMessage(
        "Account created successfully. You can now log in.",
        "success",
      );
    } catch (error) {
      console.error("Register failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        showMessage("The account information is invalid.", "error");
        throw error;
      }
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showMessage(
          `This account cannot be created with this information. Please try using a different email address or username.`,
          "error",
        );
        throw error;
      }
      showMessage("An unexpected error occurred while registering.", "error");
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
        showMessage("Invalid credentials. Please try again.", "error");
        throw error;
      }
      showMessage("An unexpected error occurred while logging in.", "error");
      throw error;
    }
  };

  // ------ Update Profile -----
  const updateProfile = async (data: UpdateAppUserInput) => {
    try {
      const updatedUser: AppUserPublic = await appUserService.updateMe(data);
      setCurrentUser(updatedUser);
      showMessage("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw error;
      }
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        showMessage("The profile information is invalid.", "error");
        throw error;
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCurrentUser(null);
        showMessage(
          "Your account could not be found. Please log in again.",
          "error",
        );
        throw error;
      }
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showMessage(
          `This account cannot be updated with this information. Please try using a different email address or username.`,
          "error",
        );
        throw error;
      }
      showMessage(
        "An unexpected error occurred while updating the profile.",
        "error",
      );
      throw error;
    }
  };
  // ------ Delete Account -----
  const deleteAccount = async () => {
    try {
      await appUserService.deleteMe();
      setCurrentUser(null);
      showMessage("Your account has been deleted successfully.", "success");
    } catch (error) {
      console.error("Delete account failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw error;
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCurrentUser(null);
        showMessage(
          "Your account could not be found. It may already have been deleted.",
          "error",
        );
        throw error;
      }
      showMessage(
        "An unexpected error occurred while deleting the account.",
        "error",
      );
      throw error;
    }
  };

  // ----- Logout -----
  const logout = async () => {
    try {
      await authService.logout();
      showMessage("You are logged out.", "info");
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return;
      }
      showMessage(
        "You are not properly logged out. Please log in again and then log out.",
        "error",
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
