//@ts-nocheck
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreenNavigator from './HomeScreenNavigator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AccountStackNavigator from './AccountStackNavigator';


const BottomBar = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#FFE6A7',
          tabBarStyle: {
            backgroundColor: '#703F07',
          },
          tabBarInactiveTintColor: '#FFE6A7',
          headerShown: false,
        }}>
        <Tab.Screen
          name="home"
          component={HomeScreenNavigator}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="explore"
          component={HomeScreenNavigator}
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="compass-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="category"
          component={HomeScreenNavigator}
          options={{
            tabBarLabel: 'Categories',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="category" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="account"
          component={AccountStackNavigator}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account-circle-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="cart"
          component={HomeScreenNavigator}
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="cart-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default BottomBar;
