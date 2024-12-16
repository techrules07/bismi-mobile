import React, {useState, useEffect, ReactNode} from 'react';
import {UserContext} from '../contexts/user-context';
import {Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const UserContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    debugger;
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
    debugger;
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData)); // Save user data in AsyncStorage
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user data to AsyncStorage:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to remove user data from AsyncStorage:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <UserContext.Provider value={{user, login, logout}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContextProvider};
