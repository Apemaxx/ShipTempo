import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Auth redirect component
const AuthRedirectHandler = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (!loading && user) {
      if (location.pathname === "/signin" || location.pathname === "/signup") {
        // Redirect to the page they were trying to access or home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    }
  }, [user, loading, navigate, location]);

  return null;
};

export const App = () => {
  return (
    <AuthProvider>
      <AuthRedirectHandler />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;