//@ts-nocheck

import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState({mobile: '', password: ''});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const validateMobileNumber = (number: string) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };

  const handleLogin = () => {
    setErrorMessage({mobile: '', password: ''});

    let isValid = true;
    if (!mobileNumber || !validateMobileNumber(mobileNumber)) {
      setErrorMessage(prev => ({
        ...prev,
        mobile: 'Please enter a valid 10-digit mobile number.',
      }));
      isValid = false;
    }
    if (!password || password.length < 6) {
      setErrorMessage(prev => ({
        ...prev,
        password: 'Password must be at least 6 characters long.',
      }));
      isValid = false;
    }
    if (isValid) {
      navigation.navigate('home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {/* Mobile Number */}
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
      {errorMessage.mobile && <Text style={styles.errorText}>{errorMessage.mobile}</Text>}

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, errorMessage.password ? styles.errorInput : null]}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(prev => !prev)}>
            <MaterialCommunityIcons
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              color="gray"
              size={28}
            />
          </TouchableOpacity>
        </View>
      </View>
      {errorMessage.password && <Text style={styles.errorText}>{errorMessage.password}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('SignUp')}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={{color: 'black'}}>Login with </Text>
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('OTP')}>
            OTP
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black'}}>Don’t have an account? </Text>
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </View>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
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
    marginTop: 20,
  },
  linkText: {
    color: '#703F07',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
});

export default LoginScreen;
