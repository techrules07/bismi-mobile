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

const SavedPaymentsPage = () => {
  const [savedPayments, setSavedPayments] = useState([
    {id: 1, type: 'Visa', last4: '1234', expiry: '12/24'},
    {id: 2, type: 'MasterCard', last4: '5678', expiry: '11/23'},
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    id: null,
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    name: '',
  });

  const handleSavePayment = () => {
    if (
      newPayment.cardNumber &&
      newPayment.expiryMonth &&
      newPayment.expiryYear &&
      newPayment.name
    ) {
      const newCard = {
        id: savedPayments.length + 1,
        type: 'Custom',
        last4: newPayment.cardNumber.slice(-4),
        expiry: `${newPayment.expiryMonth}/${newPayment.expiryYear}`,
      };

      if (newPayment.id) {
        const updatedPayments = savedPayments.map(payment =>
          payment.id === newPayment.id ? {...payment, ...newCard} : payment,
        );
        setSavedPayments(updatedPayments);
      } else {
        setSavedPayments([...savedPayments, newCard]);
      }

      setShowAddPayment(false);
      setNewPayment({
        id: null,
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        name: '',
      });
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  const handleEditPayment = payment => {
    setNewPayment({
      id: payment.id,
      cardNumber: payment.last4 ? `**** **** **** ${payment.last4}` : '',
      expiryMonth: payment.expiry.split('/')[0],
      expiryYear: payment.expiry.split('/')[1],
      name: payment.type,
    });
    setShowAddPayment(true);
  };

  const renderPaymentCard = ({item, index}) => (
    <View
      style={[
        styles.paymentCard,
        index === savedPayments.length - 1 && {marginBottom: 20},
      ]}>
      <View>
        <Text style={styles.cardType}>{item.type}</Text>
        {item.last4 ? (
          <Text style={styles.cardInfo}>**** **** **** {item.last4}</Text>
        ) : (
          <Text style={styles.cardInfo}>{item.details}</Text>
        )}
      </View>
      <View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEditPayment(item)}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setSavedPayments(
                savedPayments.filter(payment => payment.id !== item.id),
              )
            }>
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
        {item.expiry && (
          <Text style={styles.cardExpiry}>Expiry: {item.expiry}</Text>
        )}
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
          <Text style={styles.headerTitle}>Payments</Text>
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
      <View style={{padding: 20}}>
        <FlatList
          data={savedPayments}
          keyExtractor={item => item.id.toString()}
          renderItem={props => (
            <>
              {renderPaymentCard(props)}
              {props.index === savedPayments.length - 1 && !showAddPayment && (
                <TouchableOpacity
                  style={[styles.addPaymentTrigger, styles.cardWithBorder]}
                  onPress={() => setShowAddPayment(true)}>
                  <Icons name="plus" size={28} color="#703F07" />
                  <Text style={styles.addPaymentText}>Add New Payment</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          ListEmptyComponent={
            <Text style={styles.noPayments}>No saved payments found.</Text>
          }
        />
        {showAddPayment && (
          <View style={styles.addPaymentForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {newPayment.id ? 'Edit Payment' : 'Add Payment'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddPayment(false)}>
                <Icons name="close-circle-outline" size={28} color="#703F07" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter card number"
              keyboardType="numeric"
              value={newPayment.cardNumber}
              onChangeText={text =>
                setNewPayment(prev => ({...prev, cardNumber: text}))
              }
            />
            <Text style={styles.label}>Expiry Month</Text>
            <TextInput
              style={styles.input}
              placeholder="MM"
              keyboardType="numeric"
              value={newPayment.expiryMonth}
              onChangeText={text =>
                setNewPayment(prev => ({...prev, expiryMonth: text}))
              }
            />
            <Text style={styles.label}>Expiry Year</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY"
              keyboardType="numeric"
              value={newPayment.expiryYear}
              onChangeText={text =>
                setNewPayment(prev => ({...prev, expiryYear: text}))
              }
            />
            <Text style={styles.label}>Name on Card</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={newPayment.name}
              onChangeText={text =>
                setNewPayment(prev => ({...prev, name: text}))
              }
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSavePayment}>
              <Text style={styles.saveButtonText}>
                {newPayment.id ? 'Save Changes' : 'Save Payment'}
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
    // padding: 20,
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
  paymentCard: {
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
  cardType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardInfo: {
    fontSize: 16,
    color: '#666',
  },
  cardExpiry: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
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
  addPaymentTrigger: {
    flexDirection: 'row',
  },
  addPaymentText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#703F07',
  },
  addPaymentForm: {
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
  noPayments: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SavedPaymentsPage;
