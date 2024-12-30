import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ProductList from './ProductList';
import ProductListView from './ProductListView';
import CartPage from './Cart';
import Category from './Category';
import SavedAddressesPage from '../Blocks/Address/Address';
import FilterPage from '../Blocks/Category/ProductList/Filter';
import OrderList from '../Container/OrderList';

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
      <stack.Screen name="Address" component={SavedAddressesPage} />
      <stack.Screen name="FilterPage" component={FilterPage} />
      <stack.Screen name="OrderList" component={OrderList} />
    </stack.Navigator>
  );
};

export default HomeScreenNavigator;
