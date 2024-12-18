import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text} from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  otp: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const defaultProps: UserContextType = {
  user: null,
  login: () => {},
  logout: () => {},
};

const UserContext = createContext<UserContextType | null | undefined>(
  undefined,
);

const UserContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to load user data from AsyncStorage:', error);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user data to AsyncStorage:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Failed to remove user data from AsyncStorage:', error);
    }
  };

  // if (loading) {
  //   return (
  //     <React.Fragment>
  //       <Text>Loading...</Text>
  //     </React.Fragment>
  //   );
  // }

  return (
    <UserContext.Provider value={{user, login, logout}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserContextProvider};
