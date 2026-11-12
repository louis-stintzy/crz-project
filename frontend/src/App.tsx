import { useState } from "react";
import { Alert, Box } from "@mui/material";
import ClosetList from "./components/closet/ClosetList";
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
    clearMessage();
  };

  const toggleRegisterPageDisplay = () => {
    setShowRegisterPage((prev) => !prev);
    clearMessage();
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
      <Box
        sx={{
          minHeight: { xs: 112, sm: 88 },
          mb: 2,
        }}
      >
        {notification && (
          <Alert severity={notification.severity} onClose={clearMessage}>
            {notification.message}
          </Alert>
        )}
      </Box>
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
              <ClosetList />
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
