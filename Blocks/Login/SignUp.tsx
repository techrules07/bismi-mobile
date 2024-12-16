//@ts-nocheck
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useUserInfo} from '../../services/hooks/useUserInfo';
import UserAdapter from '../../services/adapters/user-adapter';
const SignUpScreen = ({route}) => {
  const {userData} = route.params;
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const validateMobileNumber = number => {
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };

  const handleSignUp = async () => {
    debugger;
    if (!mobileNumber || !validateMobileNumber(mobileNumber)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setErrorMessage('');

    try {
      const userLoginResponse = await UserAdapter?.signUp({
        id: userData?.id,
        name: userData?.name,
        phone: mobileNumber,
        email: userData?.email,
        otp: '',
      });
      if (
        userLoginResponse?.status === 'Success' &&
        userLoginResponse?.code === 200
      ) {
        console.log('User login response:', userLoginResponse);
        navigation.navigate('Home', {userData: userLoginResponse?.data});
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={[styles.input, errorMessage ? styles.errorInput : null]}
        placeholder="Enter your mobile number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  errorInput: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#703F07',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
});

export default SignUpScreen;
