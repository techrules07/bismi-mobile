import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserContext} from '../../Context/UserContext';
import {
  addAddress,
  defaultAddressApi,
  deleteAddress,
  getAddress,
  updateAddress,
} from '../../Networking/AddressPageService';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
const SavedAddressesPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedAddressTypeId, setSelectedAddressTypeId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [errors, setErrors] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  console.log('savedAddresses', savedAddresses);
  const {user} = useContext(UserContext);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const navigation = useNavigation();

  const addressTypes = {
    Home: 1,
    Work: 2,
    Office: 3,
  };
  useEffect(() => {
    if (user?.id) {
      const requestId = user.id;
      const userId = user.id;

      getAddress(requestId, userId)
        .then(data => {
          const addresses = data?.data;

          const defaultAddress = addresses?.find(address => address.default);

          if (!defaultAddress && addresses?.length > 0) {
            addresses[0].default = true;
          }

          setSavedAddresses(addresses);

          if (defaultAddress) {
            setDefaultAddress(defaultAddress.id);
          } else {
            setDefaultAddress(addresses[0]?.id);
          }
        })
        .catch(error => {
          console.log('Failed to fetch addresses:', error);
        });
    } else {
      console.log('User is not available');
    }
  }, [user]);

  const handleDefaultAddress = addressId => {
    if (user?.id) {
      const userId = user?.id;
      defaultAddressApi(addressId, userId)
        .then(data => {
          Snackbar.show({
            text: 'Default address set successfully!',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'green',
          });

          setSavedAddresses(prevAddresses =>
            prevAddresses.map(address =>
              address.id === addressId
                ? {...address, default: true}
                : {...address, default: false},
            ),
          );

          setDefaultAddress(addressId);
        })
        .catch(error => {
          Snackbar.show({
            text: 'Failed to set default address!',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
          console.log('Failed to set default address:', error);
        });
    }
  };

  const handleSaveAddress = () => {
    if (
      fullName?.length === 0 ||
      addressLine1?.length === 0 ||
      addressLine2?.length === 0 ||
      landmark?.length === 0 ||
      phone?.length === 0 ||
      pincode?.length === 0 ||
      !selectedAddressTypeId ||
      !cityId ||
      !stateId
    ) {
      return setErrors('Please fill out all fields');
    }

    const bodyData = {
      userId: user.id,
      name: fullName,
      streetName: addressLine1,
      locality: addressLine2,
      city: 1,
      state: 1,
      pincode: pincode,
      landmark: landmark,
      addressType: selectedAddressTypeId,
      phone: phone,
      default: isChecked,
    };

    if (addressId) {
      updateAddress(bodyData)
        .then(res => {
          if (res?.code === 200) {
            setErrors('');
            Snackbar.show({
              text: 'Address updated successfully!',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'green',
            });
          } else {
            setErrors(res.data.message);
            setTimeout(() => setErrors(''), 3000);
            setLoading(false);
            Snackbar.show({
              text: 'Failed to update address!',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
            });
          }
        })
        .catch(error => {
          setLoading(false);
          setErrors('Error updating address');
          console.error(error);
        });
    } else {
      addAddress(bodyData)
        .then(res => {
          if (res.data.code === 200) {
            setLoading(false);
            setErrors('');
            Snackbar.show({
              text: 'Address added successfully!',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'green',
            });
          } else {
            setErrors(res.data.message);
            setTimeout(() => setErrors(''), 3000);
            setLoading(false);
            Snackbar.show({
              text: 'Failed to add address!',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
            });
          }
        })
        .catch(error => {
          setLoading(false);
          setErrors('Error adding address');
          console.error(error);
        });
    }
  };

  const handleEditAddress = address => {
    setFullName(address.name);
    setAddressLine1(address.addressLine1);
    setAddressLine2(address.addressLine2 || '');
    setLandmark(address.landmark || '');
    setPhone(address.phone);
    setPincode(address.pincode);
    setStateId(address.state);
    setCityId(address.city);
    setSelectedAddressTypeId(addressTypes[address.addressType] || null);
    setAddressId(address.id);
    setShowAddAddress(true);
  };
  const handleCloseForm = () => {
    setFullName('');
    setAddressLine1('');
    setAddressLine2('');
    setLandmark('');
    setPhone('');
    setPincode('');
    setStateId(null);
    setCityId(null);
    setSelectedAddressTypeId(null);
    setAddressId(null);
    setShowAddAddress(false);
  };

  const handleDeleteAddress = addressId => {
    debugger;

    deleteAddress(addressId)
      .then(() => {
        setSavedAddresses(prevAddresses =>
          prevAddresses.filter(address => address.id !== addressId),
        );

        Snackbar.show({
          text: 'Address deleted successfully!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'green',
        });
      })
      .catch(error => {
        Snackbar.show({
          text: 'Failed to delete address!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
        console.log('Failed to delete address:', error);
      });
  };

  const renderAddressCard = ({item}) => (
    <View style={styles.addressCard}>
      <View>
        <Text style={styles.detailsText}>{item.name}</Text>
        <Text style={styles.addressType}>
          {item.default ? 'Default' : item.addressType}
        </Text>
        <Text style={styles.addressInfo}>{item.addressLine1}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleEditAddress(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteAddress(item.id)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
        {!item.default && (
          <TouchableOpacity onPress={() => handleDefaultAddress(item.id)}>
            <Text style={styles.actionText}>Default</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icons
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.goBack()}
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
          <ScrollView
            style={styles.addAddressForm}
            showsVerticalScrollIndicator={false}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{'Address Information'}</Text>
              <TouchableOpacity onPress={handleCloseForm}>
                <Icons name="close-circle-outline" size={28} color="#703F07" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Address Line 1</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={addressLine1}
              onChangeText={setAddressLine1}
            />
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address line 2"
              value={addressLine2}
              onChangeText={setAddressLine2}
            />
            <Text style={styles.label}>Landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter landmark"
              value={landmark}
              onChangeText={setLandmark}
            />
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
            />
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              value={pincode}
              onChangeText={setPincode}
            />
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={cityId}
              onChangeText={setCityId}
            />
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="State"
              value={stateId}
              onChangeText={setStateId}
            />
            <Text style={styles.label}>Address Type</Text>
            <View style={styles.radioButtons}>
              {['Home', 'Work', 'Office'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioButton}
                  onPress={() => setSelectedAddressTypeId(addressTypes[type])}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedAddressTypeId === addressTypes[type]
                        ? styles.radioSelected
                        : styles.radioUnselected,
                    ]}
                  />
                  <Text style={styles.radioText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAddress}>
              <Text style={styles.saveButtonText}>
                {selectedAddressTypeId ? 'Save Changes' : 'Save Address'}
              </Text>
            </TouchableOpacity>
            {errors && <Text style={styles.errorText}>{errors}</Text>}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#703F07',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EDE0D4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
  },
  label: {
    marginTop: 15,
    fontSize: 14,
    color: '#703F07',
  },
  detailsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressType: {
    fontSize: 14,
    color: '#703F07',
    // borderWidth: 1,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    alignContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  actionText: {
    color: '#703F07',
    fontSize: 14,
    marginBottom: 5,
  },
  addAddressTrigger: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  addAddressText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#703F07',
  },
  noAddresses: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop: 10,
  },
  radioButtons: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 5,
  },
  radioUnselected: {
    borderColor: '#ccc',
  },
  radioSelected: {
    borderColor: '#703F07',
    backgroundColor: '#703F07',
  },
  radioText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#703F07',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  addAddressForm: {
    marginTop: 20,
    height: 700,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SavedAddressesPage;
