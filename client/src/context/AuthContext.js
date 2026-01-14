import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { ref, set, serverTimestamp, onDisconnect } from "firebase/database";
import { db } from "../firebase/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/me");
        const currentUser = res.data.data;

        setUser(currentUser);

        // 🔹 ONLINE STATUS (Firebase Presence)
        const statusRef = ref(db, `status/${currentUser._id}`);

        set(statusRef, {
          online: true,
          lastSeen: serverTimestamp(),
        });

        onDisconnect(statusRef).set({
          online: false,
          lastSeen: serverTimestamp(),
        });
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
