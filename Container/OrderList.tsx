//@ts-nocheck
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Shirts from '../assets/Shirt.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const OrderList = props => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => props.navigation.navigate('Account')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          <Text style={styles.OrderText}>My Order</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsContainer}>
        <Text style={styles.orderId}>Order ID: #12345</Text>
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
                  <Text style={styles.arrivalText}>Arriving by Today</Text>
                </View>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => props.navigation.navigate('OrderDetails')}>
                <MaterialIcons name="arrow-forward" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
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
    marginLeft: 5,
  },
  card: {
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
  arrivalText: {
    fontSize: 14,
    color: 'green',
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
});

export default OrderList;
