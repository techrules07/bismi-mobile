import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StepperComponent from '../Component/Stepper';
import {UserContext} from '../Context/UserContext';
import {getAllOrdersById} from '../Networking/HomePageService';
import Snackbar from 'react-native-snackbar';
import {useNavigation, useRoute} from '@react-navigation/native';
import ToastMessage from '../Component/toast_message/toast_message';

const OrderDetails = props => {
  const route = useRoute();
  const {_orderItem} = route.params;
  const {user, logout} = useContext(UserContext);
  const steps = [
    {label: 'Order Placed', value: '12 Dec 2024, 10:30 AM'},
    {label: 'Shipped', value: 'Querier partner tracking id-1234567'},
    {label: 'In-Transit', value: '14 Dec 2024 Track'},
    {label: 'Out for Delivery', value: '14 Dec 2024 Track'},
    {label: 'Delivered', value: '14 Dec 2024, 12:30 PM'},
  ];
  const [listOrder, setListOrder] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [showToastFailure, setShowToastFailure] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrdersById = async () => {
      try {
        const bodyData = {
          orderId: _orderItem?.orderId,
        };

        const response = await getAllOrdersById(bodyData);

        if (response?.status === 'Success' && response?.code === 200) {
          setShowToast(true);
          setShowToastFailure(false);
          setListOrder(response?.data);
        } else {
          setShowToast(false);
          setShowToastFailure(true);
          // Snackbar.show({
          //   text: 'Failed to list order. Please try again.',
          //   duration: Snackbar.LENGTH_SHORT,
          //   backgroundColor: 'red',
          // });
        }
      } catch (error) {
        console.error('Error placing order:', error);
        // Snackbar.show({
        //   text: 'An error occurred while placing the order.',
        //   duration: Snackbar.LENGTH_SHORT,
        //   backgroundColor: 'red',
        // });
        setShowToast(false);
        setShowToastFailure(true);
      }
    };

    fetchOrdersById();
  }, [_orderItem]);

  const handleDownload = () => {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => props.navigation.navigate('OrderList')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          <Text style={styles.orderText}>Order Details</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {listOrder[0]?.orderId}</Text>
          <Text style={styles.orderId}>Date: {listOrder[0]?.createdAt}</Text>
        </View>

        <View style={styles.card}>
          {listOrder?.map((listOrder, index) => (
            <View>
              <View key={index} style={styles.cardContent}>
                <Image
                  source={{uri: listOrder?.productImage}}
                  style={styles.productImage}
                />

                <View style={styles.productDetails}>
                  <View style={styles.productRow}>
                    <Text style={styles.productName}>
                      {listOrder?.productName}
                    </Text>
                  </View>
                  <Text style={styles.productCategory}>
                    {listOrder?.productCategory}
                  </Text>
                  <Text style={styles.arrivalText}>
                    Brand: {listOrder?.brand}
                  </Text>
                  <Text style={styles.arrivalText}>
                    Size: {listOrder?.size}
                  </Text>
                  <Text style={styles.arrivalText}>
                    Qty: {listOrder?.quantity}
                  </Text>
                  <View style={styles.productPriceContainer}>
                    <Text style={styles.productPrice}>₹{listOrder?.price}</Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleDownload}>
                      <MaterialIcons
                        name="file-download"
                        size={20}
                        color="#000"
                      />
                      <Text style={styles.buttonText}>Download Invoice</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.divider} />
            </View>
          ))}

          <StepperComponent steps={steps} />
        </View>
      </View>
      {/* <View style={{alignItems: 'center'}}>
        {(showToast || showToastFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={
              showToastFailure
                ? 'Something went wrong'
                : 'Order listed succesfully'
            }
            text2={showToastFailure ? 'Failed to list order' : 'Success'}
            setToast={() => {
              setShowToast(false);
              setShowToastFailure(false);
            }}
          />
        )}
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE0D4',
  },
  profileHeader: {
    backgroundColor: '#703F07',
    height: 50,
    justifyContent: 'center',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  orderText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardsContainer: {
    flex: 1,
    marginTop: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    // backgroundColor: '#fff',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  productCategory: {
    fontSize: 14,
    color: 'gray',
  },
  arrivalText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 3,
  },
  productPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#EDE0D4',
    borderRadius: 5,
    backgroundColor: '#EDE0D4',
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default OrderDetails;
