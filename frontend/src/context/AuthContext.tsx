import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authService } from "../services/auth";
// import { AuthUser, UserCreate } from "../types/auth";
import { UserRegister } from "../types/auth";

//For type of user response
interface AuthUser {
  token: string;
  is_admin: boolean;
}
//Context Reponse
interface AuthContextType {
  // user: AuthUser | null;
  user: { token: string } | null;
  loading: boolean;
  login: (identifer: string, password: string) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => Promise<void>;
}

// Context creation deafult null
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // const [user, setUser] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getToken().then(async (token) => {
      if (token) {
        try {
          const me = await authService.getMe();
          setUser({ token, is_admin: me.is_admin });
        } catch {
          setUser({ token, is_admin: false });
        }
      }
      setLoading(false);
    });
  }, []);

  //login
  const login = async (identifier: string, password: string): Promise<void> => {
    const token = await authService.login(identifier, password);
    const me = await authService.getMe();
    setUser({ token, is_admin: me.is_admin });
  };

  //register
  //NOTE:the user is no longer auto logged in after the registration sequence completes -> the user must now hit the verification email to have their login validated
  const register = async (userData: UserRegister): Promise<void> => {
    await authService.register(userData);
  };

  //logout
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

//allows views to access the auth context
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
