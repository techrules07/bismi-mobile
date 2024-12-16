import {useState} from 'react';
import {UserContext} from '../contexts/user-context';

const UserContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState(null);

  const login = (userData: any) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{user, login, logout}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContextProvider};
