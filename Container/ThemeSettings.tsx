import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import themeConfig from '../assets/themes/themeConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeSettings = () => {
  const navigation = useNavigation();
  const [selectedTheme, setSelectedTheme] = useState('system');

  const themes = [
    {id: 'dark', label: 'Dark Mode'},
    {id: 'light', label: 'Light Mode'},
    {id: 'system', label: 'System Default'},
  ];
  // Load the theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          setSelectedTheme(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme from storage', error);
      }
    };
    loadTheme();
  }, []);

  // Save the theme to AsyncStorage
  const saveTheme = async (themeId: any) => {
    try {
      await AsyncStorage.setItem('appTheme', themeId);
      setSelectedTheme(themeId);
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <View style={themeSettingStyles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Account')}
          />
          <Text style={themeSettingStyles.headerTitle}>Theme Settings</Text>
        </View>

        <View style={themeSettingStyles.headerIcons}>
          <MaterialCommunityIcons
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>

      <View style={themeSettingStyles.container}>
        {themes.map(theme => (
          <TouchableOpacity
            key={theme.id}
            style={[
              themeSettingStyles.button,
              selectedTheme === theme.id && themeSettingStyles.buttonSelected,
            ]}
            onPress={() => saveTheme(theme.id)}>
            <View
              style={[
                selectedTheme === theme.id &&
                  themeSettingStyles.radioSelectedWrapper,
              ]}>
              <View
                style={[
                  selectedTheme === theme.id
                    ? themeSettingStyles.radioSelected
                    : themeSettingStyles.radioUnSelected,
                ]}
              />
            </View>
            <Text style={themeSettingStyles.buttonText}>{theme.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const themeSettingStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#703F07',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  container: {
    margin: 20,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    gap: 12,
  },
  buttonSelected: {
    borderColor: '#703F07',
    backgroundColor: '#FFE6CC',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  radio: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#703F07',
    backgroundColor: '#703F07',
  },
  radioUnSelected: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  radioSelectedWrapper: {
    borderWidth: 2,
    borderRadius: 50,
    padding: 2,
    borderColor: themeConfig.appPrimary,
  },
});

export default ThemeSettings;
