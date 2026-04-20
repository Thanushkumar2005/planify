import { useState } from "react";
import TaskDashboard from "./TaskDashboard";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

function App() {
  const [view, setView] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("planify_token");
    localStorage.removeItem("planify_user");
    setCurrentUser(null);
    setView("login");
  };

  if (view === "signup") {
    return <SignupPage onSwitch={() => setView("login")} onLoginSuccess={handleLoginSuccess} />;
  }

  if (view === "dashboard") {
    return <TaskDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return <LoginPage onSwitch={() => setView("signup")} onLoginSuccess={handleLoginSuccess} />;
}

export default App;