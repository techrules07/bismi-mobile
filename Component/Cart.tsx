//@ts-nocheck
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {pContext} from '../Context/ProductContext';
import {
  getAllCartItems,
  getDetails,
  placeOrder,
  quantity,
  removeCart,
} from '../Networking/HomePageService';
import {UserContext} from '../Context/UserContext';
import Snackbar from 'react-native-snackbar';
import {getAddress} from '../Networking/AddressPageService';
import {applyCoupons} from '../Networking/CouponPageService';
import ToastMessage from './toast_message/toast_message';
const CartPage = () => {
  const productContext = useContext(pContext);
  const {user, logout} = useContext(UserContext);
  const navigation = useNavigation();
  const [address, setAddress] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [allCoupons, setAllCoupons] = useState([]);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [productDetails, setProductDetails] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isCouponContainerVisible, setCouponContainerVisible] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [showToastFailure, setShowToastFailure] = useState(false);
  const [showToastRemove, setShowRemove] = useState(false);
  const [showToastRemoveFailure, setShowToastRemoveFailure] = useState(false);
  const [showToastAdd, setShowAdd] = useState(false);
  const [showToastAddFailure, setShowToastAddFailure] = useState(false);
  const [showItemRemove, setShowItemRemove] = useState(false);
  const [showItemRemoveFailure, setShowItemRemoveFailure] = useState(false);
  const [showToastCoupon, setShowCoupon] = useState(false);
  const [showToastCouponFailure, setShowToastCouponFailure] = useState(false);
  const [showToastFavorite, setShowFavorite] = useState(false);
  const [showToastFavoriteFailure, setShowToastFavoriteFailure] =
    useState(false);
  const isFocused = useIsFocused();
  const fetchCartDetails = async () => {
    try {
      const requestId = user?.id;
      if (!requestId) {
        console.warn('User ID is missing');
        setCartItems([]);
        return;
      }

      const cartData = await getAllCartItems(requestId);
      setCartItems(cartData?.data || []);
    } catch (error) {
      console.error('Error fetching cart details:', error.message);
    }
  };

  const fetchAddressDetails = async () => {
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

          setAddress(addresses);

          if (defaultAddress) {
            setDefaultAddress(defaultAddress?.id);
          } else {
            setDefaultAddress(addresses[0]?.id);
          }
        })
        .catch(error => {
          console.log('Failed to fetch addresses:', error);
        });
    } else {
      setDefaultAddress(null);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchCartDetails();
      fetchAddressDetails();
    }
  }, [user?.id, isFocused]);
  useEffect(() => {
    if (defaultAddress && address?.length > 0 && user?.id) {
      const selectedAddr = address.find(
        addressItem => addressItem.id === defaultAddress,
      );

      if (selectedAddr) {
        setSelectedAddress(selectedAddr);
      }
    } else {
      setSelectedAddress(null);
    }
  }, [defaultAddress, address, isFocused]);

  const handleAddQuantity = async id => {
    const data = {requestId: id, type: 1};
    try {
      const response = await quantity(data);
      if (response?.code === 200) {
        setCartItems(prev =>
          prev.map(item =>
            item.id === id ? {...item, quantity: item.quantity + 1} : item,
          ),
        );
        productContext?.updateQuantity(cartItems);
        // Snackbar.show({
        //   text: 'Quantity increased successfully!',
        //   duration: Snackbar.LENGTH_SHORT,
        //   backgroundColor: 'green',
        // });
        setShowAdd(true);
        setShowToastAddFailure(false);
      } else {
        throw new Error(response?.message || 'Failed to update quantity');
      }
    } catch (error) {
      setShowAdd(false);
      setShowToastAddFailure(true);
      console.error('Error increasing quantity:', error);
    }
  };

  const handleRemoveQuantity = async id => {
    const data = {requestId: id, type: 2};
    try {
      const response = await quantity(data);
      if (response?.code === 200) {
        setCartItems(prev =>
          prev.map(item =>
            item.id === id
              ? {...item, quantity: Math.max(1, item.quantity - 1)}
              : item,
          ),
        );
        productContext.updateQuantity(cartItems); // Update context
        // Snackbar.show({
        //   text: 'Quantity decreased successfully!',
        //   duration: Snackbar.LENGTH_SHORT,
        //   backgroundColor: 'green',
        // });
        setShowRemove(true);
        setShowToastRemoveFailure(false);
      } else {
        throw new Error(response?.message || 'Failed to update quantity');
      }
    } catch (error) {
      setShowRemove(false);
      setShowToastRemoveFailure(true);
      console.error('Error decreasing quantity:', error);
    }
  };

  const removeItem = async id => {
    try {
      const userId = user?.id;
      const response = await removeCart(id, userId);
      if (response?.code === 200 && response?.status === 'Success') {
        setCartItems(prev => prev.filter(item => item.id !== id));
        productContext.removeFromCart(id);
        // Snackbar.show({
        //   text: 'Product removed successfully!',
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'green',
        // });
        setShowItemRemove(true);
        setShowItemRemoveFailure(false);
      } else {
        throw new Error('Failed to remove product from cart');
      }
    } catch (error) {
      // Snackbar.show({
      //   text: error?.message || 'Something went wrong!',
      //   duration: Snackbar.LENGTH_LONG,
      //   backgroundColor: 'red',
      // });
      setShowItemRemove(false);
      setShowItemRemoveFailure(true);
    }
  };

  const moveToWishlist = item => {
    const favoriteObject = {
      userId: user?.id || 0,
      productId: item?.productId || 0,
      category: item?.availabilityId || 0,
      subCategory: item?.productCategoryId || 0,
      productCategory: item?.productCategoryId || 0,
      brand: item?.brandId || 0,
      color: item?.colorId || 0,
      unit: item?.unitId || 0,
      productSize: item?.productSizeId,
    };
    productContext?.addToFavorite(favoriteObject);
    setShowFavorite(true);
  };

  const shippingCost = 50;

  const totalPrice = cartItems?.reduce(
    (acc, item) => acc + item?.priceWithGst * item.quantity,
    0,
  );
  const cartWithDetails = cartItems.map(item => {
    const productDetail = productDetails.find(detail => detail.id === item.id);
    return productDetail ? {...item, ...productDetail} : item;
  });

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const purchaseAmount = totalPrice;
      const response = await applyCoupons({couponCode, purchaseAmount});
      if (response?.code === 200 && response?.status === 'Success') {
        setAllCoupons(response?.data);
        setCouponDiscount(response?.data?.discount || 0);
        // Snackbar.show({
        //   text: 'Coupon applied successfully!',
        //   duration: Snackbar.LENGTH_SHORT,
        //   backgroundColor: 'green',
        // });
        setShowCoupon(true);
        setShowToastCouponFailure(false);
        setCouponError('');
        setCouponContainerVisible(false);
      } else {
        throw new Error(response?.message || 'Invalid coupon');
      }
    } catch (error) {
      setShowCoupon(false);
      setShowToastCouponFailure(true);
      setCouponError(error?.message || 'Failed to apply coupon');
    }
  };
  const handleNavigate = () => {
    navigation.navigate('Address');
  };
  const handlePlaceOrder = async item => {
    try {
      const bodyData = {
        orderId: '',
        userId: user?.id,
        couponId: allCoupons?.couponId || 0,
        addressId: defaultAddress,
        paymentType: 1,
        orderItems: cartItems,
      };

      const response = await placeOrder(bodyData);

      if (response?.status === 'Success' && response?.code === 200) {
        // Snackbar.show({
        //   text: 'Order placed successfully!',
        //   duration: Snackbar.LENGTH_SHORT,
        //   backgroundColor: 'green',
        // });
        setShowToast(true);
        setShowToastFailure(false);
      } else {
        // Snackbar.show({
        //   text: 'Failed to place order. Please try again.',
        //   duration: Snackbar.LENGTH_SHORT,
        //   backgroundColor: 'red',
        // });
        setShowToast(false);
        setShowToastFailure(true);
      }

      console.log('Placing order with data:', bodyData);
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
  const navigateToOrder = () => {
    navigation.navigate('OrderList');
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Category')}
          />
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.headerIcons}>
          {/* <Icon name="magnify" size={24} color="#fff" /> */}
        </View>
      </View>
      <View style={styles.addressDetails}>
        <View style={styles.address}>
          <Text style={styles.addressText}>
            Delivery to : {selectedAddress?.name}
          </Text>
          <Text style={styles.addressText} onPress={handleNavigate}>
            CHANGE
          </Text>
        </View>
        <Text style={styles.addressTexts}>
          {selectedAddress?.addressLine1}
          {selectedAddress?.addressLine2} , {selectedAddress?.city}
        </Text>
        <Text style={styles.addressText}>
          Estimated Delivery Date : 05 Oct 2025
        </Text>
      </View>
      <ScrollView style={styles.cartItemsContainer}>
        {cartItems?.map(item => (
          <View key={item?.id} style={styles.cartItem}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Image
                source={{uri: item?.productImage}}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item?.productName}</Text>
                <Text style={styles.itemPrice}>₹{item?.priceWithGst}</Text>
              </View>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleRemoveQuantity(item.id)}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityValue}>{item?.quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleAddQuantity(item?.id)}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => removeItem(item?.id)}>
                <Text style={styles.actionText}>Remove</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <TouchableOpacity onPress={() => moveToWishlist(item)}>
                <Text style={styles.actionText}>Move to Wishlist</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.priceSummary}>
        <Text style={styles.priceHeader}>Price Details</Text>
        <View style={styles.priceDetails}>
          <Text style={styles.summaryText}>Price</Text>
          <Text style={styles.summaryValue}>₹{totalPrice}</Text>
        </View>
        <View style={styles.dividers} />
        <View style={styles.priceDetails}>
          <Text style={[styles.summaryText, styles.totalText]}>
            Total Price
          </Text>
          <Text style={[styles.summaryValue, styles.totalValue]}>
            ₹{totalPrice + shippingCost}
          </Text>
        </View>
        <View style={styles.dividers} />
      </View>

      {isCouponContainerVisible && (
        <View style={styles.couponContainer}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <Button title="Apply" color="#5b3428" onPress={handleApplyCoupon} />
          </View>
          {couponError ? (
            <Text style={styles.errorText}>{couponError}</Text>
          ) : null}
        </View>
      )}

      <View style={styles.checkoutContainer}>
        <Text style={styles.totalAmountText}>₹{totalPrice + shippingCost}</Text>
        <TouchableOpacity
          style={[styles.checkoutButton, showToast && styles.disabledButton]}
          onPress={() => handlePlaceOrder(cartItems)}
          disabled={showToast}>
          <Text style={styles.checkoutButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        {(showToast || showToastFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {
              if (!showToastFailure) {
                navigateToOrder();
              } else {
                ('');
              }
            }}
            text1={
              showToastFailure
                ? 'Something went wrong'
                : 'Order placed successfully'
            }
            text2={showToastFailure ? ' failed' : 'Go to order'}
            setToast={() => {
              setShowToast(false);
              setShowToastFailure(false);
            }}
          />
        )}
        {(showToastRemove || showToastRemoveFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={
              showToastRemoveFailure
                ? 'Something went wrong'
                : 'quantity decresed successfully'
            }
            text2={showToastRemoveFailure ? '' : ''}
            setToast={() => {
              setShowRemove(false);
              setShowToastRemoveFailure(false);
            }}
          />
        )}
        {(showToastAdd || showToastAddFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={
              showToastAddFailure
                ? 'Something went wrong'
                : 'quantity increased successfully'
            }
            text2={showToastAddFailure ? '' : ''}
            setToast={() => {
              setShowAdd(false);
              setShowToastAddFailure(false);
            }}
          />
        )}
        {(showItemRemove || showItemRemoveFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={
              showItemRemoveFailure
                ? 'Something went wrong'
                : 'Product removed successfully'
            }
            text2={showItemRemoveFailure ? '' : ''}
            setToast={() => {
              setShowItemRemove(false);
              setShowItemRemoveFailure(false);
            }}
          />
        )}
        {showToastFavorite && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={'Product added to favorite successfully'}
            text2={''}
            setToast={() => {
              setShowFavorite(false);
            }}
          />
        )}
        {(showToastCoupon || showToastCouponFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {}}
            text1={
              showToastCouponFailure
                ? 'Something went wrong'
                : 'coupon applied successfully'
            }
            text2={showToastCouponFailure ? '' : ''}
            setToast={() => {
              setShowCoupon(false);
              setShowToastCouponFailure(false);
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
    backgroundColor: '#f5f5f5',
  },
  disabledButton: {
    backgroundColor: 'gray',
    opacity: 0.6,
  },
  header: {
    padding: 15,
    backgroundColor: '#703F07',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cartItemsContainer: {
    flex: 1,
    padding: 10,
  },
  cartItem: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 3,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  checkoutButton: {
    padding: 10,
    backgroundColor: '#703F07',
    borderRadius: 5,
  },
  checkoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  priceSummary: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  priceHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  priceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  dividers: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'black',
    marginVertical: 5,
    width: '100%',
  },
  totalText: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  address: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  addressDetails: {
    padding: 10,
    backgroundColor: '#EDE0D4',
    gap: 5,
  },
  addressText: {
    color: '#703F07',
  },
  addressTexts: {
    color: 'black',
  },
  couponContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  errorText: {
    color: 'red',
  },
});

export default CartPage;
