import { useState } from "react";
import { Alert } from "@mui/material";
import ClosetManager from "./components/ClosetManager";
import LoginPage from "./components/auth/LoginPage";
import LogoutButton from "./components/auth/LogoutButton";
import RegisterPage from "./components/auth/RegisterPage";
import ProfilePage from "./components/user/ProfilePage";
import { useAuth } from "./contexts/auth/useAuth";
import { useNotification } from "./contexts/notification/useNotification";
import AppLayout from "./components/layout/AppLayout";

function App() {
  const { currentUser, isLoadingAuth } = useAuth();
  const { notification, clearMessage } = useNotification();

  const [showProfilePage, setShowProfilePage] = useState<boolean>(false);
  const [showRegisterPage, setShowRegisterPage] = useState<boolean>(false);

  const toggleProfilePageDisplay = () => {
    setShowProfilePage((prev) => !prev);
  };

  const toggleRegisterPageDisplay = () => {
    setShowRegisterPage((prev) => !prev);
  };

  const resetAuthViews = () => {
    setShowRegisterPage(false);
    setShowProfilePage(false);
  };

  if (isLoadingAuth) {
    return <p>Loading...</p>;
  }

  return (
    <AppLayout>
      {notification && (
        <Alert
          severity={notification.severity}
          onClose={clearMessage}
          sx={{ mb: 3 }}
        >
          {notification.message}
        </Alert>
      )}
      {currentUser ? (
        <>
          {showProfilePage ? (
            <ProfilePage
              currentUser={currentUser}
              onHideProfilePage={toggleProfilePageDisplay}
              onDeleteAccount={resetAuthViews}
            />
          ) : (
            <>
              <ClosetManager />
              <button type="button" onClick={toggleProfilePageDisplay}>
                Profile
              </button>
              <LogoutButton onLogout={resetAuthViews} />
            </>
          )}
        </>
      ) : (
        <>
          {!showRegisterPage ? (
            <LoginPage
              onShowRegisterPage={toggleRegisterPageDisplay}
              onLoginSuccess={resetAuthViews}
              onLoginFailure={resetAuthViews}
            />
          ) : (
            <RegisterPage
              onHideRegisterPage={toggleRegisterPageDisplay}
              onRegisterSuccess={resetAuthViews}
            />
          )}
        </>
      )}
    </AppLayout>
  );
}

export default App;
