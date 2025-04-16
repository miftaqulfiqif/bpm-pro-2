import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  username: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearAllLocalStorage = () => {
    localStorage.clear();
  };

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAllLocalStorage();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);

        axios
          .get("http://localhost:3000/api/user/current", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.status !== 200) {
              console.warn("Token invalid, logout ... ");
              setIsAuthenticated(false);
              setUser(null);
              clearAllLocalStorage();
              window.location.href = "/login";
            }
          })
          .catch((error) => {
            console.error("Auth validation error:", error);
            setIsAuthenticated(false);
            setUser(null);
            clearAllLocalStorage();
            window.location.href = "/login";
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        clearAllLocalStorage();
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
