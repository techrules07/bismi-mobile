//@ts-nocheck
import React from 'react';
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

function AppComponent(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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
  return (
    <ProductContext>
      <UserContextProvider>
        <CouponProvider>
          <AppComponent />
        </CouponProvider>
      </UserContextProvider>
    </ProductContext>
  );
};

export default App;
