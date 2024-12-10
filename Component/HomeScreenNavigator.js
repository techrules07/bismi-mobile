import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import ProductList from "./ProductList";


const HomeScreenNavigator = () => {
    const stack = createStackNavigator()

    return <stack.Navigator screenOptions={{
        headerShown: false
    }}>
            <stack.Screen name="home" component={HomeScreen} />
            <stack.Screen name="Products" component={ProductList} />
        </stack.Navigator>
}

export default HomeScreenNavigator