import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  getCurrentUser,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  refreshToken,
  LoginData,
  RegisterData,
} from "../services/auth";

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

  // Function to refresh the session using the refresh token
  const refreshSession = async (): Promise<boolean> => {
    try {
      const newToken = await refreshToken();
      if (newToken) {
        // If refresh successful, get user from sessionStorage
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
          setUser(JSON.parse(userStr));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Failed to refresh session:", err);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        // First try to get the current user with the existing token
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // If that fails, try to refresh the session
          const refreshed = await refreshSession();
          if (!refreshed) {
            // If refresh fails, clear any stale user data
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        // Try to refresh the session if loading fails
        await refreshSession();
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
      const loggedInUser = await authLogin(data);
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await authRegister(data);
      setUser(newUser);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
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

// Export as named export only for Fast Refresh compatibility
// No default export to ensure consistent exports
