import { createContext, useState } from "react";

export const AuthContext = createContext({
  login: false,
  email: "",
});

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState(false);
  return (
    <AuthContext.Provider value={{ email, setEmail, login, setLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
