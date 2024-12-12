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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const SavedAddressesPage = () => {
  const [savedAddresses, setSavedAddresses] = useState([
    {id: 1, address: '123 Main St, New York, NY', type: 'Home'},
    {id: 2, address: '456 Maple Rd, Los Angeles, CA', type: 'Work'},
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: null,
    address: '',
    type: '',
  });

  const handleSaveAddress = () => {
    if (newAddress.address && newAddress.type) {
      const newAddr = {
        id: savedAddresses.length + 1,
        address: newAddress.address,
        type: newAddress.type,
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
      setNewAddress({id: null, address: '', type: ''});
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  const handleEditAddress = address => {
    setNewAddress({
      id: address.id,
      address: address.address,
      type: address.type,
    });
    setShowAddAddress(true);
  };

  const renderAddressCard = ({item, index}) => (
    <View
      style={[
        styles.addressCard,
        index === savedAddresses.length - 1 && {marginBottom: 20},
      ]}>
      <View>
        <Text style={styles.addressType}>{item.type}</Text>
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
              <Icon name="plus-circle" size={28} color="#007bff" />
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
            <Text style={styles.label}>Address Type</Text>
            <TextInput
              style={styles.input}
              placeholder="Home, Work, etc."
              value={newAddress.type}
              onChangeText={text =>
                setNewAddress(prev => ({...prev, type: text}))
              }
            />
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
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cardWithBorder: {
    marginTop: 10,
  },
  addressType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addressInfo: {
    fontSize: 16,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  actionText: {
    fontSize: 16,
    color: 'black',
  },
  addAddressTrigger: {
    flexDirection: 'row',
  },
  addAddressText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#007bff',
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
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noAddresses: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SavedAddressesPage;
