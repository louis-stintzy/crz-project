import { useEffect, useState } from "react";
import ClosetManager from "./components/ClosetManager";
import LoginPage from "./components/auth/LoginPage";
import type { AppUserPublic } from "./types/appUser.types";
import { appUserService } from "./services/appUser.service";
import LogoutButton from "./components/auth/LogoutButton";
import RegisterPage from "./components/auth/RegisterPage";
import ProfilePage from "./components/user/ProfilePage";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AppUserPublic | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user: AppUserPublic = await appUserService.getMe();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {currentUser ? (
        <>
          <ProfilePage
            currentUser={currentUser}
            onUpdateProfile={(updatedUser) => setCurrentUser(updatedUser)}
          />
          <ClosetManager />
          <LogoutButton onLogout={() => setCurrentUser(null)} />
        </>
      ) : (
        <>
          <LoginPage onLogin={(user) => setCurrentUser(user)} />
          <RegisterPage />
        </>
      )}
    </div>
  );
}

export default App;
