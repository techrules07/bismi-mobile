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
import FAQsScreen from '../Blocks/Faqs/Faqs';
import OtpVerificationScreen from '../Blocks/Login/OTP';
import LoginScreen from '../Blocks/Login/Login';
import SignUpScreen from '../Blocks/Login/SignUp';

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
      <AccountStack.Screen name="Faqs" component={FAQsScreen} />
      <AccountStack.Screen name="OTP" component={OtpVerificationScreen} />
      <AccountStack.Screen name="Login" component={LoginScreen} />
      <AccountStack.Screen name="SignUp" component={SignUpScreen} />
    </AccountStack.Navigator>
  );
};

export default AccountStackNavigator;
