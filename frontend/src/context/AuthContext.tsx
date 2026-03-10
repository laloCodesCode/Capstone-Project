import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authService } from "../services/auth";
import { AuthUser, UserCreate } from "../types/auth";

//Context Reponse
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (identifer: string, password: string) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
}

// Context creation deafult null
const AuthContext = createContext<AuthContextType | null>(null);

// Gives the entire app auth context
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  //Check for token
  useEffect(() => {
    authService.getToken().then((token) => {
      if (token) setUser({ token });
      setLoading(false);
    });
  }, []);

  const login = async (identifer: string, password: string): Promise<void> => {
    const token = await authService.login(identifer, password);
    setUser({ token });
  };

  const register = async (userData: UserCreate): Promise<void> => {
    await authService.register(userData);

    //Allows for auto login after user registers
    await login(userData.username, userData.password);
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

//Custom hook to allow all screens to access the context
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
