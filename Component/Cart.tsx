//@ts-nocheck
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {pContext} from '../Context/ProductContext';
import {
  getAllCartItems,
  getDetails,
  quantity,
  removeCart,
} from '../Networking/HomePageService';
import {UserContext} from '../Context/UserContext';
import Snackbar from 'react-native-snackbar';
const CartPage = () => {
  const productContext = useContext(pContext);
  const {user, logout} = useContext(UserContext);
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  console.log('cartItems', cartItems);
  const [productDetails, setProductDetails] = useState([]);
  useEffect(() => {
    const fetchCartDetails = async () => {
      const requestId = user?.id;

      if (!requestId) {
        console.error('User information is missing');
        return;
      }

      try {
        const detailsResponse = await getAllCartItems(requestId);

        if (
          detailsResponse?.code === 200 &&
          detailsResponse?.status === 'Success'
        ) {
          console.log('Details retrieved successfully:', detailsResponse);
          setCartItems(detailsResponse?.data);
        } else {
          throw new Error('Failed to retrieve product details');
        }
      } catch (error) {
        console.error('Error fetching cart details:', error);
      }
    };

    fetchCartDetails();
  }, [user]);

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
        productContext.updateQuantity(cartItems);
        Snackbar.show({
          text: 'Quantity increased successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });
      } else {
        throw new Error(response?.message || 'Failed to update quantity');
      }
    } catch (error) {
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
        Snackbar.show({
          text: 'Quantity decreased successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });
      } else {
        throw new Error(response?.message || 'Failed to update quantity');
      }
    } catch (error) {
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
        Snackbar.show({
          text: 'Product removed successfully!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'green',
        });
      } else {
        throw new Error('Failed to remove product from cart');
      }
    } catch (error) {
      Snackbar.show({
        text: error?.message || 'Something went wrong!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }
  };

  const moveToWishlist = id => {
    alert(`Item with ID ${id} moved to wishlist!`);
  };

  const shippingCost = 50;

  const totalPrice = cartItems?.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );
  const cartWithDetails = cartItems.map(item => {
    const productDetail = productDetails.find(detail => detail.id === item.id);
    return productDetail ? {...item, ...productDetail} : item;
  });

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
          <Icon name="magnify" size={24} color="#fff" />
        </View>
      </View>
      <View style={styles.addressDetails}>
        <View style={styles.address}>
          <Text style={styles.addressText}>Delivery to : Danish20001</Text>
          <Text style={styles.addressText}>CHANGE</Text>
        </View>
        <Text style={styles.addressTexts}>John henry street , chennai</Text>
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
                <Text style={styles.itemName}>{item?.productCategoryName}</Text>
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
              <TouchableOpacity onPress={() => moveToWishlist(item?.id)}>
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
      <View style={styles.checkoutContainer}>
        <Text style={styles.totalAmountText}>₹{totalPrice + shippingCost}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});

export default CartPage;
