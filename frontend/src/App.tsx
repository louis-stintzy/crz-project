import { useState } from "react";
import ClosetManager from "./components/ClosetManager";
import LoginPage from "./components/LoginPage";
import type { AppUserPublic } from "./types/appUser.types";

function App() {
  const [currentUser, setCurrentUser] = useState<AppUserPublic | null>(null);

  return (
    <div>
      {currentUser ? (
        <ClosetManager />
      ) : (
        <LoginPage onLogin={(user) => setCurrentUser(user)} />
      )}
    </div>
  );
}

export default App;
