//@ts-nocheck
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import UserAdapter from '../Networking/UserPageService';
import {UserContext} from '../Context/UserContext';

const SignUpScreen = () => {
  const {user} = useContext(UserContext);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState({
    mobileNumber: '',
    fullName: '',
    email: '',
  });
  const navigation = useNavigation();

  const validateMobileNumber = number => /^[0-9]{10}$/.test(number);
  const validateEmail = mail => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const handleSignUp = async () => {
    let errors = {mobileNumber: '', fullName: '', email: ''};

    if (!mobileNumber || !validateMobileNumber(mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }
    if (!fullName) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!email || !validateEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    setErrorMessage(errors);

    if (errors.mobileNumber || errors.fullName || errors.email) return;

    try {
      const userLoginResponse = await UserAdapter.signUp({
        id: 0,
        name: fullName,
        phone: mobileNumber,
        email: email,
      });

      console.log('userLoginResponse', userLoginResponse);

      if (
        userLoginResponse?.status === 'Success' &&
        userLoginResponse?.code === 200
      ) {
        const userData = userLoginResponse.data;
        console.log('userData', userData);
        await AsyncStorage?.setItem('user', JSON.stringify(userData));
        navigation.navigate('Account');
      } else {
        setErrorMessage(prev => ({
          ...prev,
          general: 'Something went wrong.',
        }));
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setErrorMessage(prev => ({
        ...prev,
        general: 'An error occurred. Please try again.',
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={[styles.input, errorMessage.fullName ? styles.errorInput : null]}
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
      />
      {errorMessage.fullName ? (
        <Text style={styles.errorText}>{errorMessage.fullName}</Text>
      ) : null}

      <TextInput
        style={[styles.input, errorMessage.email ? styles.errorInput : null]}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {errorMessage.email ? (
        <Text style={styles.errorText}>{errorMessage.email}</Text>
      ) : null}

      <TextInput
        style={[
          styles.input,
          errorMessage.mobileNumber ? styles.errorInput : null,
        ]}
        placeholder="Enter your mobile number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      {errorMessage.mobileNumber ? (
        <Text style={styles.errorText}>{errorMessage.mobileNumber}</Text>
      ) : null}

      {errorMessage.general ? (
        <Text style={styles.errorText}>{errorMessage.general}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Register</Text>
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
    marginBottom: 10,
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
