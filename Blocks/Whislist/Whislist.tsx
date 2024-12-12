import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
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

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Nike Running Shoes',
      price: 2999,
      imageUrl: 'https://via.placeholder.com/150',
      isWishlist: true,
    },
    {
      id: 2,
      name: 'Apple iPhone 13',
      price: 79999,
      imageUrl: 'https://via.placeholder.com/150',
      isWishlist: true,
    },
    {
      id: 3,
      name: 'Samsung 4K TV',
      price: 49999,
      imageUrl: 'https://via.placeholder.com/150',
      isWishlist: true,
    },
    {
      id: 4,
      name: 'Sony Headphones',
      price: 8999,
      imageUrl: 'https://via.placeholder.com/150',
      isWishlist: true,
    },
  ]);

  const moveToCart = itemId => {
    Alert.alert('Success', 'Item moved to cart');
    // Logic to add the item to cart
  };

  const removeFromWishlist = itemId => {
    setWishlist(prevWishlist =>
      prevWishlist.filter(item => item.id !== itemId),
    );
    Alert.alert('Success', 'Item removed from wishlist');
  };
  const navigation = useNavigation();
  const renderItem = ({item}) => (
    <View>
      <View style={styles.productCard}>
        <Image source={{uri: item.imageUrl}} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          <View style={styles.starWrapper}>
            <Icon name="star" size={20} color="orange" />
            <Icon name="star" size={20} color="orange" />
            <Icon name="star" size={20} color="orange" />
            <Icon name="star" size={20} color="orange" />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.moveButton}
              onPress={() => moveToCart(item.id)}>
              <Text style={styles.buttonText}>Move to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromWishlist(item.id)}>
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
          <Icon name="magnify" size={24} color="#fff" />
          <Icon
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>
      <View style={{padding: 10}}>
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
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
    // marginBottom: 15,
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
