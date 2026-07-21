import { useState } from "react";
import ClosetManager from "./components/ClosetManager";
import LoginPage from "./components/auth/LoginPage";
import LogoutButton from "./components/auth/LogoutButton";
import RegisterPage from "./components/auth/RegisterPage";
import ProfilePage from "./components/user/ProfilePage";
import { useAuth } from "./contexts/auth/useAuth";

function App() {
  const { currentUser, isLoadingAuth } = useAuth();

  const [showProfilePage, setShowProfilePage] = useState<boolean>(false);
  const [showRegisterPage, setShowRegisterPage] = useState<boolean>(false);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  const toggleProfilePageDisplay = () => {
    setShowProfilePage((prev) => !prev);
    setGlobalMessage(null);
  };

  const toggleRegisterPageDisplay = () => {
    setShowRegisterPage((prev) => !prev);
    setGlobalMessage(null);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterPage(false);
    // setCurrentUser(null);
    setGlobalMessage("Account created successfully. You can now log in.");
  };

  const handleLoginSuccess = () => {
    setShowRegisterPage(false);
    setShowProfilePage(false);
    // setCurrentUser(user);
    setGlobalMessage(null);
  };

  const handleLogoutSuccess = () => {
    setShowRegisterPage(false);
    setShowProfilePage(false);
    // setCurrentUser(null);
    setGlobalMessage("You are logged out.");
  };

  const handleUpdateProfileSuccess = () => {
    // setCurrentUser(user);
    setGlobalMessage("Profile updated successfully!");
  };

  const handleDeleteAccountSuccess = () => {
    setShowRegisterPage(false);
    setShowProfilePage(false);
    // setCurrentUser(null);
    setGlobalMessage("Your account has been deleted successfully.");
  };

  const handleValidationError = () => {
    setGlobalMessage("The profile information is invalid.");
  };

  const handleUnauthorizedError = (action: "login" | "update" | "delete") => {
    setShowRegisterPage(false);
    setShowProfilePage(false);
    // setCurrentUser(null);
    if (action === "login") {
      setGlobalMessage("Invalid credentials. Please try again.");
      return;
    }
    setGlobalMessage(
      `Your session has expired. ${action === "update" ? "Your profile has not been updated." : "Your account was not deleted."} Please log in again.`,
    );
  };

  // TODO: Handle 404 on /users/me as an invalid session for getMe, updateMe and deleteMe.

  const handleConflictError = (action: "register" | "update") => {
    setGlobalMessage(
      `This account cannot be ${action === "register" ? "created" : "updated"} with this information. Please try using a different email address or username.`,
    );
  };

  const handleServerError = (message: string) => {
    setGlobalMessage(message);
  };

  if (isLoadingAuth) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {currentUser ? (
        <>
          {showProfilePage ? (
            <ProfilePage
              currentUser={currentUser}
              onHideProfilePage={toggleProfilePageDisplay}
              onUpdateProfile={handleUpdateProfileSuccess}
              onDeleteAccount={handleDeleteAccountSuccess}
              onValidationError={handleValidationError}
              onUnauthorizedError={handleUnauthorizedError}
              onConflictError={() => handleConflictError("update")}
              onServerError={handleServerError}
            />
          ) : (
            <>
              <ClosetManager />
              <button type="button" onClick={toggleProfilePageDisplay}>
                Profile
              </button>
              <LogoutButton onLogout={handleLogoutSuccess} />
            </>
          )}
        </>
      ) : (
        <>
          {!showRegisterPage ? (
            <LoginPage
              onShowRegisterPage={toggleRegisterPageDisplay}
              onLoginSuccess={handleLoginSuccess}
              onUnauthorizedError={() => handleUnauthorizedError("login")}
              onServerError={handleServerError}
            />
          ) : (
            <RegisterPage
              onHideRegisterPage={toggleRegisterPageDisplay}
              onRegisterSuccess={handleRegisterSuccess}
              onValidationError={handleValidationError}
              onConflictError={() => handleConflictError("register")}
              onServerError={handleServerError}
            />
          )}
        </>
      )}
      {globalMessage && <p>{globalMessage}</p>}
    </div>
  );
}

export default App;
