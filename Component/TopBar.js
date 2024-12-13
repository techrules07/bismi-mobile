import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreenNavigator from './HomeScreenNavigator';
import AccountStackNavigator from './AccountStackNavigator';


const TopBar = ({ navigation }) => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.tab}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
        <Text style={styles.tab}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <Text style={styles.tab}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const AppNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <TopBar {...props} />, 
        }}>
        <Stack.Screen name="Home" component={HomeScreenNavigator} />
        <Stack.Screen name="Categories" component={HomeScreenNavigator} />
        <Stack.Screen name="Account" component={AccountStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#703F07',
    paddingHorizontal: 10,
  },
  tab: {
    color: '#FFE6A7',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
