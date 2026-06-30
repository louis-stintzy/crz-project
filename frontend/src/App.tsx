import { useEffect, useState } from "react";
import ClosetManager from "./components/ClosetManager";
import LoginPage from "./components/LoginPage";
import type { AppUserPublic } from "./types/appUser.types";
import { appUserService } from "./services/appUser.service";
import LogoutButton from "./components/LogoutButton";

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
          <ClosetManager />
          <LogoutButton onLogout={() => setCurrentUser(null)} />
        </>
      ) : (
        <LoginPage onLogin={(user) => setCurrentUser(user)} />
      )}
    </div>
  );
}

export default App;
