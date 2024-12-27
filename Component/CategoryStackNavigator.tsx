import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShirtList from '../Blocks/Category/ProductList/ShirtList';
import CategoryForMens from '../Blocks/Category/CategoryForMens';
import ProductListView from './ProductListView';
import CartPage from './Cart';
import FilterPage from '../Blocks/Category/ProductList/Filter';
import Category from './Category';
import OrderList from '../Container/OrderList';

const CategoryStack = createStackNavigator();

const CategoryStackNavigator = () => {
  return (
    <CategoryStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <CategoryStack.Screen name="Category" component={Category} />
      <CategoryStack.Screen name="ShirtList" component={ShirtList} />
      <CategoryStack.Screen
        name="CategoryForMens"
        component={CategoryForMens}
      />
      <CategoryStack.Screen
        name="ProductListView"
        component={ProductListView}
      />
      <CategoryStack.Screen name="Cart" component={CartPage} />
      <CategoryStack.Screen name="FilterPage" component={FilterPage} />
      <CategoryStack.Screen name="OrderList" component={OrderList} />
    </CategoryStack.Navigator>
  );
};

export default CategoryStackNavigator;
