import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Account from '../Blocks/Account';
import OrderList from '../Container/OrderList';
import OrderDetails from '../Container/OrderDetails';
import CouponsPage from '../Blocks/Coupons/Coupons';
import WishlistPage from '../Blocks/Whislist/Whislist';
import EditProfilePage from '../Blocks/EditProfile/EditProfile';
import SavedPaymentsPage from '../Blocks/Payments/Payments';
import SavedAddressesPage from '../Blocks/Address/Address';

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
      <AccountStack.Screen name="Coupons" component={CouponsPage} />
      <AccountStack.Screen name="Whislist" component={WishlistPage} />
      <AccountStack.Screen name="EditProfile" component={EditProfilePage} />
      <AccountStack.Screen name="Payment" component={SavedPaymentsPage} />
      <AccountStack.Screen name="Address" component={SavedAddressesPage} />
    </AccountStack.Navigator>
  );
};

export default AccountStackNavigator;
