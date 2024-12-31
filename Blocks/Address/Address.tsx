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
import ToastMessage from '../../Component/toast_message/toast_message';
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
  const [addressLine1Error, setAddressLine1Error] = useState('');
  const [addressLine2Error, setAddressLine2Error] = useState('');
  const [landmarkError, setLandmarkError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [addressTypeError, setAddressTypeError] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');
  const [isAddressLine1Focused, setIsAddressLine1Focused] = useState(false);
  const [isAddressLine2Focused, setIsAddressLine2Focused] = useState(false);
  const [isLandmarkFocused, setIsLandmarkFocused] = useState(false);
  const [isFullNameFocused, setIsFullNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPincodeFocused, setIsPincodeFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isStateFocused, setIsStateFocused] = useState(false);
  const [isAddressTypeFocused, setIsAddressTypeFocused] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showToastFailure, setShowToastFailure] = useState(false);
  const [showToastDefault, setShowToastDefault] = useState(false);
  const [showToastDefaultFailure, setShowToastDefaultFailure] = useState(false);
  const [showToastDelete, setShowToastDelete] = useState(false);
  const [showToastDeleteFailure, setShowToastDeleteFailure] = useState(false);
  const [showToastMessage, setShowToastMessage] = useState('');
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
          // Snackbar.show({
          //   text: 'Default address set successfully!',
          //   duration: Snackbar.LENGTH_LONG,
          //   backgroundColor: 'green',
          // });
          setShowToastDefault(true);
          setShowToastDefaultFailure(false);
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
          // Snackbar.show({
          //   text: 'Failed to set default address!',
          //   duration: Snackbar.LENGTH_LONG,
          //   backgroundColor: 'red',
          // });
          setShowToastDefault(false);
          setShowToastDefaultFailure(true);
          console.log('Failed to set default address:', error);
        });
    }
  };

  const handleSaveAddress = () => {
    let hasError = false;

    setAddressLine1Error('');
    setAddressLine2Error('');
    setLandmarkError('');
    setFullNameError('');
    setPhoneError('');
    setPincodeError('');
    setCityError('');
    setStateError('');
    setAddressTypeError('');

    if (!fullName?.length) {
      setFullNameError('Full name is required');
      hasError = true;
    }

    if (!addressLine1?.length) {
      setAddressLine1Error('Address line 1 is required');
      hasError = true;
    }

    if (!addressLine2?.length) {
      setAddressLine2Error('Address line 2 is required');
      hasError = true;
    }

    if (!landmark?.length) {
      setLandmarkError('Landmark is required');
      hasError = true;
    }

    if (!phone?.length) {
      setPhoneError('Phone number is required');
      hasError = true;
    }

    if (!pincode?.length) {
      setPincodeError('Pincode is required');
      hasError = true;
    }

    if (!selectedAddressTypeId) {
      setAddressTypeError('Address type is required');
      hasError = true;
    }

    if (!cityId) {
      setCityError('City is required');
      hasError = true;
    }

    if (!stateId) {
      setStateError('State is required');
      hasError = true;
    }

    if (hasError) {
      return;
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

    const addressAction = addressId ? updateAddress : addAddress;
    addressAction(bodyData)
      .then(res => {
        const successMessage = addressId
          ? 'Address updated successfully!'
          : 'Address added successfully!';
        const errorMessage = addressId
          ? 'Failed to update address!'
          : 'Failed to add address!';

        if (res?.code === 200 || res.data.code === 200) {
          // Snackbar.show({
          //   text: successMessage,
          //   duration: Snackbar.LENGTH_SHORT,
          //   backgroundColor: 'green',
          // });
          setShowToast(true);
          setShowToastFailure(false);
          setShowToastMessage(successMessage);
          console.log(successMessage);
        } else {
          console.log(errorMessage);
          setShowToast(false);
          setShowToastFailure(true);
          setShowToastMessage(errorMessage);

          // Snackbar.show({
          //   text: errorMessage,
          //   duration: Snackbar.LENGTH_SHORT,
          //   backgroundColor: 'red',
          // });
        }
      })
      .catch(error => {
        // Snackbar.show({
        //   text: 'Error saving address',
        //   duration: Snackbar.LENGTH_SHORT,
        //   backgroundColor: 'red',
        // });
        console.log('Error saving address');
        setShowToast(false);
        setShowToastFailure(true);
        setShowToastMessage('Error saving address');
        console.error(error);
      });
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
    deleteAddress(addressId)
      .then(() => {
        setSavedAddresses(prevAddresses =>
          prevAddresses.filter(address => address.id !== addressId),
        );
        setShowToastDelete(true);
        setShowToastDeleteFailure(false);
        // Snackbar.show({
        //   text: 'Address deleted successfully!',
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'green',
        // });
      })
      .catch(error => {
        // Snackbar.show({
        //   text: 'Failed to delete address!',
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'red',
        // });
        setShowToastDelete(false);
        setShowToastDeleteFailure(true);
        console.log('Failed to delete address:', error);
      });
  };
  const getInputStyle = (fieldError, isFocused) => {
    return {
      borderColor: fieldError ? 'red' : isFocused ? '#ccc' : '#ccc',
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      marginBottom: 5,
    };
  };
  const handleFocus = field => {
    if (field === 'addressLine1') {
      setIsAddressLine1Focused(true);
      setAddressLine1Error('');
    } else if (field === 'addressLine2') {
      setIsAddressLine2Focused(true);
      setAddressLine2Error('');
    } else if (field === 'landmark') {
      setIsLandmarkFocused(true);
      setLandmarkError('');
    } else if (field === 'fullName') {
      setIsFullNameFocused(true);
      setFullNameError('');
    } else if (field === 'phone') {
      setIsPhoneFocused(true);
      setPhoneError('');
    } else if (field === 'pincode') {
      setIsPincodeFocused(true);
      setPincodeError('');
    } else if (field === 'city') {
      setIsCityFocused(true);
      setCityError('');
    } else if (field === 'state') {
      setIsStateFocused(true);
      setStateError('');
    } else if (field === 'addressType') {
      setIsAddressTypeFocused(true);
      setAddressTypeError('');
    }
  };
  const handleBlur = field => {
    switch (field) {
      case 'addressLine1':
        setIsAddressLine1Focused(false);
        break;
      case 'addressLine2':
        setIsAddressLine2Focused(false);
        break;
      case 'landmark':
        setIsLandmarkFocused(false);
        break;
      case 'fullName':
        setIsFullNameFocused(false);
        break;
      case 'phone':
        setIsPhoneFocused(false);
        break;
      case 'pincode':
        setIsPincodeFocused(false);
        break;
      case 'city':
        setIsCityFocused(false);
        break;
      case 'state':
        setIsStateFocused(false);
        break;
      case 'addressType':
        setIsAddressTypeFocused(false);
        break;
      default:
        break;
    }
  };
  const renderAddressCard = ({item}) => (
    <View style={styles.addressCard}>
      <View>
        <Text style={styles.detailsText}>{item.name}</Text>
        <View style={styles.addressContainer}>
          <View style={styles.addressType}>
            <Text>{item.default ? 'Default' : item.addressType}</Text>
          </View>
        </View>

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
  const navigateToAddressList = () => {
    navigation.navigate('Address');
  };
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
          {/* <Icons name="magnify" size={24} color="#fff" /> */}
          <Icons
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>
      {!showAddAddress ? (
        <ScrollView contentContainerStyle={{padding: 12}}>
          <FlatList
            data={savedAddresses}
            keyExtractor={item => item.id.toString()}
            renderItem={renderAddressCard}
            ListEmptyComponent={
              <Text style={styles.noAddresses}>No saved addresses found.</Text>
            }
          />
          <TouchableOpacity
            style={[styles.addAddressTrigger, styles.cardWithBorder]}
            onPress={() => setShowAddAddress(true)}>
            <Icons name="plus" size={28} color="#703F07" />
            <Text style={styles.addAddressText}>Add New Address</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{padding: 12}}
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
            style={getInputStyle(addressLine1Error, isAddressLine1Focused)}
            placeholder="Enter address"
            value={addressLine1}
            onChangeText={setAddressLine1}
            onFocus={() => handleFocus('addressLine1')}
            onBlur={() => handleBlur('addressLine1')}
          />
          {addressLine1Error && !isAddressLine1Focused ? (
            <Text style={styles.errorText}>{addressLine1Error}</Text>
          ) : null}

          <Text style={styles.label}>Address Line 2</Text>
          <TextInput
            style={getInputStyle(addressLine2Error, isAddressLine2Focused)}
            placeholder="Enter address line 2"
            value={addressLine2}
            onChangeText={setAddressLine2}
            onFocus={() => handleFocus('addressLine2')}
            onBlur={() => handleBlur('addressLine2')}
          />
          {addressLine2Error && !isAddressLine2Focused ? (
            <Text style={styles.errorText}>{addressLine2Error}</Text>
          ) : null}

          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={getInputStyle(landmarkError, isLandmarkFocused)}
            placeholder="Enter landmark"
            value={landmark}
            onChangeText={setLandmark}
            onFocus={() => handleFocus('landmark')}
            onBlur={() => handleBlur('landmark')}
          />
          {landmarkError && !isLandmarkFocused ? (
            <Text style={styles.errorText}>{landmarkError}</Text>
          ) : null}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={getInputStyle(fullNameError, isFullNameFocused)}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => handleFocus('fullName')}
            onBlur={() => handleBlur('fullName')}
          />
          {fullNameError && !isFullNameFocused ? (
            <Text style={styles.errorText}>{fullNameError}</Text>
          ) : null}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={getInputStyle(phoneError, isPhoneFocused)}
            placeholder="Phone Number"
            value={phone}
            onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))}
            onFocus={() => handleFocus('phone')}
            onBlur={() => handleBlur('phone')}
          />
          {phoneError && !isPhoneFocused ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={getInputStyle(pincodeError, isPincodeFocused)}
            placeholder="Pincode"
            value={pincode}
            onChangeText={text => setPincode(text.replace(/[^0-9]/g, ''))}
            onFocus={() => handleFocus('pincode')}
            onBlur={() => handleBlur('pincode')}
          />
          {pincodeError && !isPincodeFocused ? (
            <Text style={styles.errorText}>{pincodeError}</Text>
          ) : null}

          <Text style={styles.label}>City</Text>
          <TextInput
            style={getInputStyle(cityError, isCityFocused)}
            placeholder="City"
            value={cityId}
            onChangeText={setCityId}
            onFocus={() => handleFocus('city')}
            onBlur={() => handleBlur('city')}
          />
          {cityError && !isCityFocused ? (
            <Text style={styles.errorText}>{cityError}</Text>
          ) : null}

          <Text style={styles.label}>State</Text>
          <TextInput
            style={getInputStyle(stateError, isStateFocused)}
            placeholder="State"
            value={stateId}
            onChangeText={setStateId}
            onFocus={() => handleFocus('state')}
            onBlur={() => handleBlur('state')}
          />
          {stateError && !isStateFocused ? (
            <Text style={styles.errorText}>{stateError}</Text>
          ) : null}

          <Text style={styles.label}>Address Type</Text>
          <View style={styles.radioButtons}>
            {['Home', 'Work', 'Office'].map(type => (
              <TouchableOpacity
                key={type}
                style={styles.radioButton}
                onPress={() => {
                  setSelectedAddressTypeId(addressTypes[type]);
                  setIsAddressTypeFocused(true);
                }}>
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
          {addressTypeError && !isAddressTypeFocused ? (
            <Text style={styles.errorText}>{addressTypeError}</Text>
          ) : null}
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
      <View style={{alignItems: 'center'}}>
        {(showToastDefault || showToastDefaultFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={
              showToastDefaultFailure
                ? 'Something went wrong'
                : 'Address set to default'
            }
            text2={showToastDefaultFailure ? '' : ''}
            setToast={() => {
              setShowToastDefault(false);
              setShowToastDefaultFailure(false);
            }}
          />
        )}
        {(showToastDelete || showToastDeleteFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={
              showToastDeleteFailure
                ? 'Something went wrong'
                : 'Address deleted successfully'
            }
            text2={showToastDeleteFailure ? 'Failed' : 'Success'}
            setToast={() => {
              setShowToastDelete(false);
              setShowToastDeleteFailure(false);
            }}
          />
        )}
        {(showToast || showToastFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {
              if (!showToastFailure) {
                navigateToAddressList();
              } else {
                ('');
              }
            }}
            text1={
              showToastFailure
                ? showToastMessage || 'Something went wrong'
                : showToastMessage || 'Address added/update successfully'
            }
            text2={showToastFailure ? '' : ''}
            setToast={() => {
              setShowToast(false);
              setShowToastFailure(false);
              setShowToastMessage('');
            }}
          />
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
  addressContainer: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
    width: 70,
  },
  addressType: {
    fontSize: 14,
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#703F07',
    padding: 10,
    alignItems: 'center',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
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
    margin: 3,
  },

  addressInfo: {
    fontSize: 14,
    color: '#333',
    margin: 3,
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

  // addAddressForm: {
  //   paddingHorizontal: 16,
  //   paddingVertical: 20,
  // },
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
