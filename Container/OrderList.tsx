//@ts-nocheck
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Shirts from '../assets/Shirt.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getAllOrders} from '../Networking/HomePageService';
import {UserContext} from '../Context/UserContext';
import Snackbar from 'react-native-snackbar';

const OrderList = props => {
  const [listOrder, setListOrder] = useState([]);
  const {user, logout} = useContext(UserContext);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const bodyData = {
          requestId: user?.id,
          userId: user?.id,
        };

        const response = await getAllOrders(bodyData);

        if (response?.status === 'Success' && response?.code === 200) {
          Snackbar.show({
            text: 'Order Listed successfully!',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'green',
          });
          console.log(response?.data, 'before setListOrder');
          setListOrder(response?.data);
        } else {
          Snackbar.show({
            text: 'Failed to list order. Please try again.',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
          });
        }

        console.log('Placing order with data:', bodyData);
      } catch (error) {
        console.error('Error placing order:', error);
        Snackbar.show({
          text: 'An error occurred while placing the order.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      }
    };

    fetchOrders();
  }, [user, props.navigation]);
  console.log(listOrder);
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => props.navigation.navigate('Account')}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            <Text style={styles.OrderText}>My Order</Text>
          </TouchableOpacity>
        </View>
        {listOrder.map(_orderItem => (
          <View style={styles.cardsContainer}>
            <Text style={styles.orderId}>Order ID: #{_orderItem?.orderId}</Text>
            <View style={styles.card}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.cardContent}>
                  <Image
                    source={{uri: _orderItem?.orderItems?.[0]?.productImage}}
                    style={styles.productImage}
                  />
                  <View style={{display: 'flex'}}>
                    <View style={{display: 'flex', marginBottom: 20}}>
                      <Text style={styles.productName}>
                        {_orderItem?.orderItems?.[0]?.productName}
                      </Text>
                      <Text style={{marginTop: 3}}>
                        {_orderItem?.orderItems?.[0]?.productCategory}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.arrivalText}>
                        {_orderItem?.orderStatus}
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={() => props.navigation.navigate('OrderDetails')}>
                    <MaterialIcons
                      name="arrow-forward"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.divider} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
    // marginBottom: 5,
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
