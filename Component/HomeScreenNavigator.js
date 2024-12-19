import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ProductList from './ProductList';
import ProductListView from './ProductListView';
import CartPage from './Cart';
import Category from './Category';

const HomeScreenNavigator = () => {
  const stack = createStackNavigator();

  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <stack.Screen name="home" component={HomeScreen} />
      <stack.Screen name="Products" component={ProductList} />
      <stack.Screen name="ProductListView" component={ProductListView} />
      <stack.Screen name="Cart" component={CartPage} />
      <stack.Screen name="Category" component={Category} />
    </stack.Navigator>
  );
};

export default HomeScreenNavigator;
