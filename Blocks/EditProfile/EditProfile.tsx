//@ts-nocheck
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserAdapter from '../../Networking/UserPageService';
import {UserContext} from '../../Context/UserContext';
import ToastMessage from '../../Component/toast_message/toast_message';
import Loader from '../../Component/Loader';

const EditProfilePage = () => {
  const {user, getUserDetail, userDetail} = useContext(UserContext);
  console.log('userDetail', userDetail);

  //usestate management
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState({
    phone: '',
    firstName: '',
    email: '',
  });

  //useEffect
  useEffect(() => {
    fetchUserProfile();
  }, [user]);

//function handling
  const fetchUserProfile = async () => {
    const requestId = user?.id;
    const userId = user?.id;
    setLoading(true);
    if (!userId) {
      console.error('User ID is missing');
      setErrorMessage('User ID is missing');
      return;
    }

    try {
      const response = await UserAdapter?.getProfile({requestId, userId});
      console.log('getUser', response);

      if (response?.status === 'Success' && response?.code === 200) {
        getUserDetail(response?.data);
        await AsyncStorage.setItem(
          'userDetail',
          JSON.stringify(response?.data),
        );
        setFirstName(response?.data?.name || '');
        setEmail(response?.data?.email || '');
        setPhone(response?.data?.phone || '');
        setLoading(false);
      } else {
        setErrorMessage('Something went wrong.');
      }
    } catch (error) {
      console.error('Error in getProfile:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };


  const validateMobileNumber = (number: number) => /^[0-9]{10}$/.test(number);
  const validateEmail = (mail: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);


  const handleSaveProfile = async () => {
    let errors = {mobileNumber: '', fullName: '', email: ''};

    if (!phone || !validateMobileNumber(phone)) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }
    if (!firstName) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!email || !validateEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    setErrorMessage(errors);

    if (errors.mobileNumber || errors.fullName || errors.email) return;

    try {
      const addUser = await UserAdapter?.signUp({
        id: user?.id,
        name: firstName,
        phone: phone,
        email: email,
      });

      console.log('addUser', addUser);

      if (addUser?.status === 'Success' && addUser?.code === 200) {
        const userData = addUser?.data;
        console.log('userData', userData);
        await AsyncStorage?.setItem('user', JSON.stringify(userData));
        setShowToast(true);
        fetchUserProfile();
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

  const handleImageEdit = () => {
    Alert.alert(
      'Edit Profile Image',
      'Image upload functionality can be added here!',
    );
  };

  const getInitial = () => {
    return firstName ? firstName?.charAt(0).toUpperCase() : '';
  };
  
  const navigation = useNavigation();


  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Icon
                  name="arrow-left"
                  size={24}
                  color="#fff"
                  onPress={() => navigation.navigate('Account', {firstName})}
                />
                   <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <View style={styles.headerIcons}>
               <Icon
                name="cart"
                size={24}
                color="#fff"
                onPress={() => navigation.navigate('Cart')}
              />
            </View>
          </View>
          <View>
               {loading ? (
                    <View style={styles.loaderContainer}>
                        <Loader />
                    </View>
                ) : (
                    <View style={{padding: 20}}>
                        <View style={styles.imageContainer}>
                            <View style={styles.profilePhoto}>
                               {firstName ? (
                                 <Text style={styles.initialText}>
                                         {getInitial(firstName)}
                                 </Text>
                  ) : (
                    <Text style={styles.initialText}>?</Text>
                               )}
              </View>
          </View>
              <Text style={styles.userName}>{`${firstName} ${lastName}`}</Text>
              <Text style={styles.userPhone}>{phone}</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter First Name"
                />
                {errorMessage?.firstName ? (
                  <Text style={styles.errorText}>
                    {errorMessage?.firstName}
                  </Text>
                ) : null}
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email"
                  keyboardType="email-address"
                />
                {errorMessage?.email ? (
                  <Text style={styles.errorText}>{errorMessage?.email}</Text>
                ) : null}

                <Text style={styles.label}>Mobile</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter Mobile Number"
                  keyboardType="phone-pad"
                />
                {errorMessage?.phone ? (
                  <Text style={styles.errorText}>{errorMessage?.phone}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}>
                <Text style={styles.buttonText}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      <View style={{alignItems: 'center'}}>
        {showToast && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => navigation.navigate('Account', {firstName})}
            text1={'Profile added successfully'}
            text2={'Go to account'}
            setToast={setShowToast}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#703F07',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerIcons: {flexDirection: 'row', gap: 15},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  loaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    top: 260,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: '#FFE6A7',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  initialText: {
    fontSize: 40,
    color: '#703F07',
    fontWeight: 'bold',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#EDE0D4',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#703F07',
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 5,
  },
  radioSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#703F07',
    marginRight: 5,
  },
  radioText: {
    fontSize: 16,
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#703F07',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfilePage;
