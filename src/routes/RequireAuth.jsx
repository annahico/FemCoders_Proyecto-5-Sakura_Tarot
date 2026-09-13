import { Navigate } from "react-router-dom";

// Guards a route behind a logged-in session. Login/register write the
// current user to localStorage("user") on success; without that, /tarot
// and /history were reachable by anyone typing the URL directly.
export const RequireAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
