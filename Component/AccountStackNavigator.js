import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../Blocks/Account';



const AccountStack = createStackNavigator();

const AccountStackNavigator = () => {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AccountStack.Screen name="Account" component={Account} />
      {/* <AccountStack.Screen name="AccountDetails" component={AccountDetails} /> */}
    </AccountStack.Navigator>
  );
};

export default AccountStackNavigator;
