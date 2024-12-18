import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Login';
import SignUpScreen from './SignUp';
import OtpVerificationScreen from './OTP';

const LoginScreenStack = createStackNavigator(); // Use capital "S"

const LoginScreenNavigator = () => {
  return (
   
      <LoginScreenStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <LoginScreenStack.Screen name="Login" component={LoginScreen} />
        <LoginScreenStack.Screen name="SignUp" component={SignUpScreen} />
        <LoginScreenStack.Screen name="OTP" component={OtpVerificationScreen} />
      </LoginScreenStack.Navigator>

  );
};

export default LoginScreenNavigator;
