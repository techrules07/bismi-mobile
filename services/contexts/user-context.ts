import { createContext } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    otp: string;
  }
  
  // Define the Context's Value type
  interface UserContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
  }

  let defaultProps: UserContextType = {
    user: null,
    login: (userData: User) => {},
    logout: () => {}
  }
  
  export const UserContext = createContext(defaultProps)