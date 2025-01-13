import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Shirts from '../assets/Shirt.jpg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getAllOrders, cancelOrderApi} from '../Networking/HomePageService'; // Assuming `cancelOrderApi` is your API call for cancellation
import {UserContext} from '../Context/UserContext';
import Snackbar from 'react-native-snackbar';
import ToastMessage from '../Component/toast_message/toast_message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Loader from '../Component/Loader';
const OrderList = props => {
  const [listOrder, setListOrder] = useState([]);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const {user, logout} = useContext(UserContext);
  const [showToast, setShowToast] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showSubmitFailure, setShowSubmitFailure] = useState(false);
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const bodyData = {
          requestId: user?.id,
          userId: user?.id,
        };
        const order_list = await getAllOrders(bodyData);
        if (order_list?.data) {
          let all_orders = [];
          if (
            order_list?.data &&
            Array.isArray(order_list?.data) &&
            order_list.data?.length > 0
          ) {
            all_orders = order_list?.data;
            all_orders?.sort((a, b) => {
              const dateA = moment(a.createdAt, 'DD/MM/YYYY');
              const dateB = moment(b.createdAt, 'DD/MM/YYYY');
              return dateB.diff(dateA);
            });
          }
          setListOrder(all_orders);
          setShowToast(true);
        } else {
          setListOrder([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused && user) {
      fetchOrders();
    }
  }, [user, props.navigation]);

  const handleCancelOrder = async orderId => {
    if (!cancelReason.trim()) {
      Snackbar.show({
        text: 'Please provide a reason for cancellation.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      return;
    }

    try {
      const response = await cancelOrderApi({orderId, reason: cancelReason});

      if (response?.status === 'Success') {
        setShowSubmit(true);
        setShowSubmitFailure(false);
        console.log('Order cancelled successfully!');
        const updatedOrders = listOrder.map(order =>
          order.orderId === orderId
            ? {...order, orderStatus: 'Cancelled'}
            : order,
        );
        setListOrder(updatedOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      } else {
        setShowSubmit(false);
        setShowSubmitFailure(true);
        console.error('Error cancelling order:');
      }
    } catch (error) {
      setShowSubmit(false);
      setShowSubmitFailure(true);
      console.error('Error cancelling order:', error);
    }
  };

  const navigateToAccount = () => {
    navigation.navigate('Account');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <View>
          <View style={styles.profileHeader}>
            <TouchableOpacity
              style={styles.header}
              onPress={() => props.navigation.navigate('Account')}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="white"
              />
              <Text style={styles.OrderText}>My Order</Text>
            </TouchableOpacity>
          </View>
          {!user && (
            <View>
              <Text style={styles.OrderText}>You are not logged in.</Text>
            </View>
          )}
          {loading ? (
            <View style={styles.loaderContainer}>
              <Loader />
            </View>
          ) : user && listOrder.length > 0 ? (
            listOrder.map(_orderItem => (
              <View style={styles.cardsContainer} key={_orderItem?.orderId}>
                <Text style={styles.orderId}>
                  Order ID: #{_orderItem?.orderId}
                </Text>

                <View style={styles.card}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={styles.cardContent}>
                      <Image
                        source={{
                          uri: _orderItem?.orderItems?.[0]?.productImage,
                        }}
                        style={styles.productImage}
                      />
                      <View style={{display: 'flex'}}>
                        <Text style={styles.productName}>
                          {_orderItem?.orderItems?.[0]?.productName}
                        </Text>
                        <Text style={{marginTop: 3}}>
                          {_orderItem?.orderItems?.[0]?.productCategory}
                        </Text>
                        <Text
                          style={[
                            styles.arrivalText,
                            _orderItem?.orderStatus === 'Cancelled' && {
                              color: 'red',
                            },
                          ]}>
                          {_orderItem?.orderStatus}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() =>
                          props.navigation.navigate('OrderDetails', {
                            _orderItem,
                          })
                        }>
                        <MaterialIcons
                          name="arrow-forward"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.dividers} />

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('OrderDetails', {_orderItem})
                      }>
                      <Text style={styles.actionText}>View Order</Text>
                    </TouchableOpacity>

                    <View style={styles.verticalDivider} />

                    <TouchableOpacity
                      onPress={() => setCancelOrderId(_orderItem?.orderId)}>
                      <Text style={styles.actionText}>Cancel Order</Text>
                    </TouchableOpacity>
                  </View>

                  {cancelOrderId === _orderItem?.orderId && (
                    <View style={styles.cancelInputContainer}>
                      <TextInput
                        style={styles.cancelInput}
                        placeholder="Enter reason for cancellation"
                        value={cancelReason}
                        onChangeText={setCancelReason}
                      />
                      <TouchableOpacity
                        style={styles.submitCancelButton}
                        onPress={() => handleCancelOrder(_orderItem?.orderId)}>
                        <Text style={styles.submitCancelText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text>Your cart is empty</Text>
          )}
        </View>
      </ScrollView>

      <View style={{alignItems: 'center'}}>
        {showToast && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => navigateToAccount()}
            text1={'Order Listed successfully'}
            text2={'Go to account'}
            setToast={setShowToast}
          />
        )}
        {(showSubmit || showSubmitFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={
              showSubmitFailure
                ? 'Something went wrong'
                : 'Order cancelled successfully'
            }
            text2={''}
            setToast={() => {
              setShowSubmit(false);
              setShowSubmitFailure(false);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE0D4',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  dividers: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {
    color: 'black',
    fontSize: 14,
    marginRight: 50,
    marginLeft: 50,
  },
  arrivalText: {
    fontSize: 14,
    color: 'green',
  },
  cancelInputContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  cancelInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  submitCancelButton: {
    backgroundColor: '#703F07',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitCancelText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding:10
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
