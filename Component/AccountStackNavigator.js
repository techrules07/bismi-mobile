import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../Blocks/Account';
import OrderList from '../Container/OrderList';
import OrderDetails from '../Container/OrderDetails';



const AccountStack = createStackNavigator();

const AccountStackNavigator = () => {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AccountStack.Screen name="Account" component={Account} />
      <AccountStack.Screen name="OrderList" component={OrderList} />
      <AccountStack.Screen name="OrderDetails" component={OrderDetails} />
    </AccountStack.Navigator>
  );
};

export default AccountStackNavigator;
