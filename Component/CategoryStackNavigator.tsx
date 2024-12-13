import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Category from '../Blocks/Category/Category';
import ShirtList from '../Blocks/Category/ShirtList/ShirtList';
import CategoryForMens from '../Blocks/Category/CategoryForMens';
import ShirtListView from '../Blocks/Category/ShirtList/ShirtListView';
import CartPage from '../Blocks/Category/Cart/Cart';
import FilterPage from '../Blocks/Category/ShirtList/Filter';

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
      <CategoryStack.Screen name="ShirtListView" component={ShirtListView} />
      <CategoryStack.Screen name="Cart" component={CartPage} />
      <CategoryStack.Screen name="FilterPage" component={FilterPage} />
    </CategoryStack.Navigator>
  );
};

export default CategoryStackNavigator;
