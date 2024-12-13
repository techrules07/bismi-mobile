import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RadioButton,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const SavedAddressesPage = () => {
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      address: '123 Main St, New York, NY',
      type: 'Home',
      fullName: 'John Doe',
      phone: '123-456-7890',
      altPhone: '987-654-3210',
      pincode: '10001',
      city: 'New York',
      state: 'NY',
    },
    {
      id: 2,
      address: '456 Maple Rd, Los Angeles, CA',
      type: 'Work',
      fullName: 'Jane Smith',
      phone: '234-567-8901',
      altPhone: '876-543-2109',
      pincode: '90001',
      city: 'Los Angeles',
      state: 'CA',
    },
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: null,
    address: '',
    type: 'Home', // Default type
    fullName: '',
    phone: '',
    altPhone: '',
    pincode: '',
    city: '',
    state: '',
  });

  const handleSaveAddress = () => {
    if (
      newAddress.address &&
      newAddress.fullName &&
      newAddress.phone &&
      newAddress.pincode &&
      newAddress.city &&
      newAddress.state
    ) {
      const newAddr = {
        id: savedAddresses.length + 1,
        address: newAddress.address,
        type: newAddress.type,
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        altPhone: newAddress.altPhone,
        pincode: newAddress.pincode,
        city: newAddress.city,
        state: newAddress.state,
      };

      if (newAddress.id) {
        const updatedAddresses = savedAddresses.map(address =>
          address.id === newAddress.id ? {...address, ...newAddr} : address,
        );
        setSavedAddresses(updatedAddresses);
      } else {
        setSavedAddresses([...savedAddresses, newAddr]);
      }

      setShowAddAddress(false);
      setNewAddress({
        id: null,
        address: '',
        type: 'Home',
        fullName: '',
        phone: '',
        altPhone: '',
        pincode: '',
        city: '',
        state: '',
      });
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  const handleEditAddress = address => {
    setNewAddress(address);
    setShowAddAddress(true);
  };

  const renderAddressCard = ({item, index}) => (
    <View
      style={[
        styles.addressCard,
        index === savedAddresses.length - 1 && {marginBottom: 20},
      ]}>
      <View>
        <View style={styles.details}>
          <Text style={styles.detailsText}>{item.fullName}</Text>
          <Text style={styles.addressType}>{item.type}</Text>
        </View>

        <Text style={styles.addressInfo}>{item.address}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleEditAddress(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setSavedAddresses(
              savedAddresses.filter(address => address.id !== item.id),
            )
          }>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icons
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Account')}
          />
          <Text style={styles.headerTitle}>Address</Text>
        </View>

        <View style={styles.headerIcons}>
          <Icons name="magnify" size={24} color="#fff" />
          <Icons
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>
      <View style={{padding: 20}}>
        {!showAddAddress ? (
          <>
            <FlatList
              data={savedAddresses}
              keyExtractor={item => item.id.toString()}
              renderItem={renderAddressCard}
              ListEmptyComponent={
                <Text style={styles.noAddresses}>
                  No saved addresses found.
                </Text>
              }
            />
            <TouchableOpacity
              style={[styles.addAddressTrigger, styles.cardWithBorder]}
              onPress={() => setShowAddAddress(true)}>
              <Icons name="plus" size={28} color="#703F07" />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.addAddressForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {newAddress.id ? 'Edit Address' : 'Add Address'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddAddress(false)}>
                <Icons name="close-circle-outline" size={28} color="#703F07" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={newAddress.address}
              onChangeText={text =>
                setNewAddress(prev => ({...prev, address: text}))
              }
            />
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={newAddress.fullName}
              onChangeText={text =>
                setNewAddress(prev => ({...prev, fullName: text}))
              }
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newAddress.phone}
              onChangeText={text =>
                setNewAddress(prev => ({...prev, phone: text}))
              }
            />

            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              value={newAddress.pincode}
              onChangeText={text =>
                setNewAddress(prev => ({...prev, pincode: text}))
              }
            />
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={newAddress.city}
              onChangeText={text =>
                setNewAddress(prev => ({...prev, city: text}))
              }
            />
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="State"
              value={newAddress.state}
              onChangeText={text =>
                setNewAddress(prev => ({...prev, state: text}))
              }
            />
            <Text style={styles.label}>Address Type</Text>
            <View style={styles.radioButtons}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() =>
                  setNewAddress(prev => ({...prev, type: 'Home'}))
                }>
                <View
                  style={[
                    styles.radioCircle,
                    newAddress.type === 'Home'
                      ? styles.radioSelected
                      : styles.radioUnselected,
                  ]}
                />
                <Text style={styles.radioText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() =>
                  setNewAddress(prev => ({...prev, type: 'Work'}))
                }>
                <View
                  style={[
                    styles.radioCircle,
                    newAddress.type === 'Work'
                      ? styles.radioSelected
                      : styles.radioUnselected,
                  ]}
                />
                <Text style={styles.radioText}>Work</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAddress}>
              <Text style={styles.saveButtonText}>
                {newAddress.id ? 'Save Changes' : 'Save Address'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    padding: 10,
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
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#EDE0D4',
  },
  cardWithBorder: {
    marginTop: 10,
  },
  addressType: {
    borderRadius: 5,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    color: '#703F07',
    width: 50,
    textAlign: 'center',
  },
  details: {
    flexDirection: 'row',
    gap: 10,
  },
  addressInfo: {
    fontSize: 16,
    color: '#666',
  },
  detailsText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  actionText: {
    fontSize: 16,
    color: '#703F07',
  },
  addAddressTrigger: {
    flexDirection: 'row',
  },
  addAddressText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#703F07',
    marginTop: 3,
  },
  addAddressForm: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#703F07',
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioButtons: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 20,
    gap: 30,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#703F07',
    borderColor: '#703F07',
  },
  radioUnselected: {
    backgroundColor: '#fff',
    borderColor: 'gray',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  noAddresses: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SavedAddressesPage;
