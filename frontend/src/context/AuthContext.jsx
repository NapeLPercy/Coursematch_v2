import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Optional: Restore user from localStorage after refresh
  useEffect(() => {
    const saved = sessionStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Save user to localStorage when changed
  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
    else sessionStorage.clear();
  }, [user]);

  // Helper login & logout functions
  const login = (userData) => {
    setUser(userData);
    
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
