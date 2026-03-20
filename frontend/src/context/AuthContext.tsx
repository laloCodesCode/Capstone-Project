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

/*
 * old context that automatically logged in user after
 * registertion
 */
// // Gives the entire app auth context
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);
//
//   //Check for token
//   //useEffect(() => {
//   //  authService.getToken().then((token) => {
//   //     if (token) setUser({ token });
//   //   setLoading(false);
//   //  });
//   //  }, []);
//
//   useEffect(() => {
//     setUser({ token: "dev-token" });
//     setLoading(false);
//   }, []);
//   const login = async (identifer: string, password: string): Promise<void> => {
//     const token = await authService.login(identifer, password);
//     setUser({ token });
//   };
//
//   const register = async (userData: UserCreate): Promise<void> => {
//     await authService.register(userData);
//
//     //Allows for auto login after user registers
//     await login(userData.username, userData.password);
//   };
//
//   const logout = async (): Promise<void> => {
//     await authService.logout();
//     setUser(null);
//   };
//
//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
//
// //Custom hook to allow all screens to access the context
// export const useAuth = (): AuthContextType => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
//   return ctx;
// };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getToken().then((token) => {
      if (token) setUser({ token });
      setLoading(false);
    });
  }, []);

  //login
  const login = async (identifier: string, password: string): Promise<void> => {
    const token = await await authService.login(identifier, password);
    setUser({ token });
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
