//@ts-nocheck
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import HomeScreenNavigator from './HomeScreenNavigator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AccountStackNavigator from './AccountStackNavigator';
import CategoryStackNavigator from './CategoryStackNavigator';
import CartPage from './Cart';
import LoginScreenNavigator from './LoginStackNavigtor';
import ExploreScreen from './ExploreScreen';

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    // Screens where the bottom bar should be hidden
    if (
      [
        'OrderDetails',
        'OrderList',
        'Products',
        'ShirtList',
        'ProductListView',
        'Cart',
        'Coupons',
        'Whislist',
        'EditProfile',
        'Payment',
        'Address',
        'Faqs',
        'FilterPage',
      ].includes(routeName)
    ) {
      return {display: 'none'};
    }
    return {display: 'flex', backgroundColor: '#703F07'};
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: '#703F07',
          },
          tabBarInactiveTintColor: '#FFE6A7',
          headerShown: false,
        }}>
        <Tab.Screen
          name="home"
          component={HomeScreenNavigator}
          options={({route}) => ({
            tabBarLabel: 'Home',
            tabBarStyle: getTabBarVisibility(route),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          })}
        />
        {/* <Tab.Screen
          name="explore"
          component={ExploreScreen}
          options={({route}) => ({
            tabBarLabel: 'Explore',
            tabBarStyle: getTabBarVisibility(route),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="compass-outline"
                color={color}
                size={size}
              />
            ),
          })}
        /> */}
        <Tab.Screen
          name="category"
          component={CategoryStackNavigator}
          options={({route}) => ({
            tabBarLabel: 'Categories',
            tabBarStyle: getTabBarVisibility(route),
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="category" color={color} size={size} />
            ),
          })}
        />
        <Tab.Screen
          name="account"
          component={AccountStackNavigator}
          options={({route}) => ({
            tabBarLabel: 'Account',
            tabBarStyle: getTabBarVisibility(route),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account-circle-outline"
                color={color}
                size={size}
              />
            ),
          })}
        />
        <Tab.Screen
          name="cart"
          component={CartPage}
          options={({route}) => ({
            tabBarLabel: 'Cart',
            tabBarStyle: getTabBarVisibility(route),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="cart-outline"
                color={color}
                size={size}
              />
            ),
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomBar;
