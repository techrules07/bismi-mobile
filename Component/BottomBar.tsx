import React from "react";
import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import HomeScreenNavigator from "./HomeScreenNavigator";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomBar = () => {

  const Tab = createBottomTabNavigator();

  return <NavigationContainer>
    <Tab.Navigator screenOptions={{
        tabBarActiveTintColor: '#FFE6A7',
        tabBarStyle: {
          backgroundColor: '#703F07'
        },
        tabBarInactiveTintColor: '#FFE6A7',
        headerShown: false
      }}>
      <Tab.Screen name="home" component={HomeScreenNavigator} options={{tabBarLabel: "Home", tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          )}}  />
           <Tab.Screen name="explore" component={HomeScreenNavigator} options={{tabBarLabel: "Explore", tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compass-outline" color={color} size={size} />
          )}}  />
           <Tab.Screen name="account" component={HomeScreenNavigator} options={{tabBarLabel: "Home", tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          )}}  />
           <Tab.Screen name="cart" component={HomeScreenNavigator} options={{tabBarLabel: "Explore", tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart-outline" color={color} size={size} />
          )}}  />
    </Tab.Navigator>
  </NavigationContainer>

}
export default BottomBar;