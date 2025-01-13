import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
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

const EditProfilePage = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [gender, setGender] = useState('male');
  const [email, setEmail] = useState('johndoe@example.com');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [phone, setPhone] = useState('1234567890');
  const [profileImage, setProfileImage] = useState(
    'https://via.placeholder.com/150',
  );

  const handleSaveProfile = () => {
    Alert.alert('Profile Saved', 'Your profile has been updated successfully!');
  };

  const handleImageEdit = () => {
    Alert.alert(
      'Edit Profile Image',
      'Image upload functionality can be added here!',
    );
  };
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Account')}
          />
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.headerIcons}>
          <Icon name="magnify" size={24} color="#fff" />
          <Icon
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>
      <View style={{padding: 20}}>
        <View style={styles.imageContainer}>
          <Image source={{uri: profileImage}} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIcon} onPress={handleImageEdit}>
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.userPhone}>{phone}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter First Name"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter Last Name"
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setGender('male')}>
              <View
                style={gender === 'male' ? styles.radioSelected : styles.radio}
              />
              <Text style={styles.radioText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setGender('female')}>
              <View
                style={
                  gender === 'female' ? styles.radioSelected : styles.radio
                }
              />
              <Text style={styles.radioText}>Female</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Birth Date</Text>
          <TextInput
            style={styles.input}
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter Mobile Number"
            keyboardType="phone-pad"
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
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
