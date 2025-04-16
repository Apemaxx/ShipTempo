import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import AuthService, { LoginData, RegisterData, User } from "../services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Changed to named export and const arrow function for Fast Refresh compatibility
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Initialize the auth service with navigation function
  useEffect(() => {
    AuthService.setNavigate(navigate);
  }, [navigate]);

  // Updated refreshSession to use AuthService.getCurrentUser
  const refreshSession = async (): Promise<boolean> => {
    try {
      // The getCurrentUser method already handles token refresh
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to refresh session:", err);
      return false;
    }
  };

  // Setup auth event listeners
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };

    const handleLogin = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.user) {
        setUser(customEvent.detail.user);
      }
    };

    // Add event listeners
    AuthService.onAuthEvent("logout", handleLogout as any);
    AuthService.onAuthEvent("login", handleLogin as any);

    // Remove event listeners on cleanup
    return () => {
      AuthService.offAuthEvent("logout", handleLogout as any);
      AuthService.offAuthEvent("login", handleLogin as any);
    };
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        // Use the getCurrentUser method which handles token refresh internally
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await AuthService.login(data);
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.message || "Failed to login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await AuthService.register(data);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message || "Failed to register");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    // No need to setUser(null) here as we're listening for the logout event
    // and the AuthService will handle navigation to the login page
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};