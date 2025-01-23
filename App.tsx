//@ts-nocheck
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Login from './Component/Login';
import {ProductContext} from './Context/ProductContext';
import Home from './Component/BottomBar';
import AppNavigator from './Component/TopBar';
import {UserContextProvider} from './Context/UserContext';
import {CouponProvider} from './Context/CouponContext';
import {ThemeContext} from './Context/ThemeContext';
import Orientation from 'react-native-orientation-locker'; 

function AppComponent(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <SafeAreaView style={{display: 'flex', flex: 1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {/* <AppNavigator/> */}
      <Home />
    </SafeAreaView>
  );
}

const App = () => {
  const [appTheme, setAppTheme] = useState('dark');

  const updateTheme = (newTheme: any) => {
    if (!newTheme) {
      newTheme = 'dark';
    } else {
      newTheme = newTheme;
    }
    setAppTheme(newTheme);
  };
  return (
    <ThemeContext.Provider value={{appTheme, updateTheme}}>
      <ProductContext>
        <UserContextProvider>
          <CouponProvider>
            <AppComponent />
          </CouponProvider>
        </UserContextProvider>
      </ProductContext>
    </ThemeContext.Provider>
  );
};

export default App;
