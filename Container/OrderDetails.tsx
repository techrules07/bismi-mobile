//@ts-nocheck
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Shirts from '../assets/Shirt.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StepperComponent from '../Component/Stepper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const OrderDetails = props => {
  const steps = [
    {label: 'Order Placed', value: '12 Dec 2024, 10:30 AM'},
    {label: 'Shipped', value: 'Querier partner tracking id-1234567'},
    {label: 'In-Transit', value: '14 Dec 2024 Track'},
    {label: 'Out for Delivery', value: '14 Dec 2024 Track'},
    {label: 'Delivered', value: '14 Dec 2024, 12:30 PM'},
  ];

  const handleDownload = () => {
    console.log('Invoice download');
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => props.navigation.navigate('OrderList')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          <Text style={styles.OrderText}>Order Details</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsContainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 7,
          }}>
          <Text style={styles.orderId}>Order ID: #12345</Text>
          <Text style={styles.orderId}>Date: 05 Dec 2025</Text>
        </View>

        <View style={styles.card}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.cardContent}>
              <Image source={Shirts} style={styles.productImage} />
              <View style={{display: 'flex'}}>
                <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                  <Text style={styles.productName}>Shirt</Text>
                  <Text style={{marginTop: 3}}>Casual Wear</Text>
                </View>
                <View>
                  <Text style={styles.arrivalText}>Size : XXL</Text>
                </View>
                <View>
                  <Text style={styles.arrivalText}>Qty : 01</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 50,
                  }}>
                  <Text style={styles.productPrice}>₹1500</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleDownload}>
                    <MaterialIcons
                      name="file-download"
                      size={20}
                      color="#000"
                    />
                    <Text style={styles.text}>Download Invoice</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <StepperComponent steps={steps} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE0D4',
  },
  cardsContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 5,
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  profileHeader: {
    backgroundColor: '#703F07',
    height: 50,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  arrivalText: {
    fontSize: 14,
    color: 'black',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  OrderText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  iconWrapper: {
    marginTop: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EDE0D4',
    borderRadius: 5,
    backgroundColor: '#EDE0D4',
  },
  text: {
    marginLeft: 5, // Space between icon and text
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default OrderDetails;
