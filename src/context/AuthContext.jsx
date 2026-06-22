import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user")
    )
  );
  
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      newSocket.emit("register_user", user.id);

      newSocket.on("notification", (data) => {
        toast.info(data.message, {
          icon: <Bell size={20} color="var(--color-primary)" />
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const login = (userData, token) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      token
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);