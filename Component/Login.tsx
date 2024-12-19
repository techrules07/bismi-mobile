//@ts-nocheck
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAdapter from '../Networking/UserPageService';

const LoginScreen = () => {
  const [userData, setUserData] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState({
    mobile: '',
    otp: '',
  });
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const validateMobileNumber = (number: string) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };

  const handleLogin = async () => {
    setErrorMessage({mobile: '', otp: ''});

    let isValid = true;
    if (!mobileNumber || !validateMobileNumber(mobileNumber)) {
      setErrorMessage(prev => ({
        ...prev,
        mobile: 'Please enter a valid 10-digit mobile number.',
      }));
      isValid = false;
    }

    if (isValid) {
      try {
        setIsLoading(true);
        const userLoginResponse = await UserAdapter.userLogin({
          name: '',
          phone: mobileNumber,
          email: '',
          otp: '',
        });

        if (
          userLoginResponse?.status === 'Success' &&
          userLoginResponse?.code === 200
        ) {
          const userData = userLoginResponse.data;
          console.log('userData', userData);
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          if (userData?.registered === true) {
            setIsOtpVisible(true);
            setUserData(userData);
          } else {
            setErrorMessage({
              ...errorMessage,
              mobile: 'Your number is not registered yet.',
            });
            navigation.navigate('SignUp', {userData: userLoginResponse?.data});
          }
        } else {
          setErrorMessage(prev => ({
            ...prev,
            mobile: 'Invalid mobile number. Please try again.',
          }));
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(prev => ({
          ...prev,
          mobile: 'An error occurred. Please try again.',
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrorMessage(prev => ({
        ...prev,
        otp: 'Please enter a valid 6-digit OTP.',
      }));
      return;
    }

    try {
      const userLoginResponse = await UserAdapter?.verifyLogin({
        id: userData?.id,
        name: '',
        phone: userData?.phone,
        email: '',
        otp: otp,
      });

      if (
        userLoginResponse?.status === 'Success' &&
        userLoginResponse?.code === 200
      ) {
        await AsyncStorage.setItem(
          'user',
          JSON.stringify(userLoginResponse?.data),
        );

        navigation.navigate('Account', {userData: userLoginResponse?.data});
        console.log('userLoginResponse', userLoginResponse);
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={[styles.input, errorMessage.mobile ? styles.errorInput : null]}
          placeholder="Enter your mobile number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
        />
      </View>
      {errorMessage.mobile && (
        <Text style={styles.errorText}>{errorMessage.mobile}</Text>
      )}

      {!isOtpVisible && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging in...' : 'Get OTP'}
          </Text>
        </TouchableOpacity>
      )}

      {isOtpVisible && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={[styles.input, errorMessage.otp ? styles.errorInput : null]}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />
          {errorMessage.otp && (
            <Text style={styles.errorText}>{errorMessage.otp}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{flexDirection: 'row'}}>
        <Text style={{color: 'black'}}>Don’t have an account? </Text>
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('SignUp')}>
          Register
        </Text>
      </View>
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
    color: '#703F07',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    display: 'flex',
    justifyContent: 'row',
    marginTop: 20,
  },
  linkText: {
    color: '#703F07',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },
});

export default LoginScreen;