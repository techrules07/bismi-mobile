import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserContext} from '../../Context/UserContext';
import {pContext} from '../../Context/ProductContext';
import Snackbar from 'react-native-snackbar';
import {addToCart} from '../../Networking/HomePageService';
import {ScrollView} from 'react-native-gesture-handler';
import ToastMessage from '../../Component/toast_message/toast_message';

const WishlistPage = () => {
  const {user} = useContext(UserContext);
  const productContext = useContext(pContext);
  const [wishlist, setWishlist] = useState([]);
  console.log('whislist', wishlist);
  const [removingItem, setRemovingItem] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showToastFailure, setShowToastFailure] = useState(false);
  const [showToastRemove, setShowToastRemove] = useState(false);
  const [showToastRemoveFailure, setShowToastRemoveFailure] = useState(false);
  useEffect(() => {
    if (user?.id) {
      const data = {
        requestId: user.id,
        exclusive: true,
      };
      productContext?.fetchFavoriteItems(data);
    }
  }, [user]);

  useEffect(() => {
    if (productContext?.favoriteItems?.data) {
      setWishlist(productContext.favoriteItems.data);
    }
  }, [productContext?.favoriteItems]);

  const addToCarts = async selectedItem => {
    const defaultItem = {
      id: selectedItem?.id || selectedItem?.productId,
      userId: user?.id,
      productId: selectedItem?.id || selectedItem?.productId,
      category: selectedItem?.availabilityId || selectedItem?.categoryId,
      subCategory: selectedItem?.productCategoryId,
      productCategory: selectedItem?.productCategoryId,
      brand: selectedItem?.brandId,
      color: selectedItem?.colorId,
      unit: selectedItem?.unitId,
      productSize:
        parseFloat(selectedItem?.productSize?.replace(/[^\d.-]/g, '')) ||
        selectedItem?.size?.replace(/[^\d.-]/g, '') ||
        0,
      quantity: 1,
      active: true,
    };

    try {
      const cartResponse = await addToCart(defaultItem);

      if (cartResponse?.code === 200 && cartResponse?.status === 'Success') {
        productContext?.addToCart(defaultItem);

        // Snackbar.show({
        //   text: 'Product added to cart successfully!',
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'green',
        // });

        await removeFromWishlist(selectedItem);
        setShowToast(true);
        setShowToastFailure(false);
        // Alert.alert('Success', 'Item moved to cart');
      } else {
        setShowToast(false);
        setShowToastFailure(true);
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      // Snackbar.show({
      //   text: error?.message || 'Something went wrong!',
      //   duration: Snackbar.LENGTH_LONG,
      //   backgroundColor: 'red',
      // });
      setShowToast(false);
      setShowToastFailure(true);
    }
  };

  const removeFromWishlist = async item => {
    if (removingItem) return;

    setRemovingItem(item.productId);

    try {
      const data = {
        userId: user?.id,
        productId: item?.productId,
        exclusive: true,
      };

      // Make the API call to remove the item from the wishlist
      await productContext?.removeFromFavorite?.(data);

      console.log('Item removed from favorite');
      setShowToastRemove(true);
      setShowToastRemoveFailure(false);

      // Update wishlist immediately after the item is removed from the favorites.
      setWishlist(prevWishlist => {
        const updatedWishlist = prevWishlist.filter(
          wishlistItem => wishlistItem.productId !== item.productId,
        );
        console.log('Updated wishlist:', updatedWishlist);
        return updatedWishlist; // Ensure the updated wishlist is returned
      });
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      setShowToastRemove(false);
      setShowToastRemoveFailure(true);
    } finally {
      setRemovingItem(null); // Reset removing state to allow new actions
    }
  };

  const navigation = useNavigation();
  const navigateToCart = () => {
    navigation.navigate('Cart', {
      selectedItem,
    });
  };
  const renderItem = ({item}) => (
    <View>
      <View style={styles.productCard}>
        <Image source={{uri: item.productImage}} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>
            {item.productName || item.productCategory}
          </Text>
          <Text style={styles.productPrice}>₹{item.priceWithGst}</Text>
          <View style={styles.starWrapper}>
            <Icon name="star" size={20} color="orange" />
            <Icon name="star" size={20} color="orange" />
            <Icon name="star" size={20} color="orange" />
            <Icon name="star" size={20} color="orange" />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.moveButton}
              onPress={() => addToCarts(item)}>
              <Text style={styles.buttonText}>Move to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.removeButton,
                removingItem === item.productId && {opacity: 0.5},
              ]}
              onPress={() => removeFromWishlist(item)}
              disabled={removingItem === item.productId}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.divider}></View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Account')}
          />
          <Text style={styles.headerTitle}>WishList</Text>
        </View>

        <View style={styles.headerIcons}>
          {/* <Icon name="magnify" size={24} color="#fff" /> */}
          <Icon
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>
      <ScrollView style={{padding: 10}}>
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
      <View style={{alignItems: 'center'}}>
        {(showToast || showToastFailure) && (
          <ToastMessage
            text1Press={() => {}}
            text2Press={() => {
              if (!showToastFailure) {
                navigateToCart();
              } else {
                ('');
              }
            }}
            text1={
              showToastFailure ? 'Something went wrong' : 'Item move to cart'
            }
            text2={showToastFailure ? 'Failed' : 'Success'}
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
                : 'Item remove from wishlist'
            }
            text2={showToastRemoveFailure ? 'Failure' : 'Success'}
            setToast={() => {
              setShowToast(false);
              setShowToastFailure(false);
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
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
    width: '100%',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 30,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    shadowColor: '#000',
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  productDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  starWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  moveButton: {
    backgroundColor: '#703F07',
    borderRadius: 5,
    width: '38%',
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: '#703F07',
    borderRadius: 5,
    width: '33%',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default WishlistPage;
