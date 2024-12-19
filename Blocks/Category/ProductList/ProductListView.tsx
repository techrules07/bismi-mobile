//@ts-nocheck
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {addToCart} from '../../../Networking/HomePageService';
import {pContext} from '../../../Context/ProductContext';
import {UserContext} from '../../../Context/UserContext';
import Snackbar from 'react-native-snackbar';
const ProductDetails = ({
  selectedItem,
  favorites,
  toggleFavorite,
  similarItem,
  onSelectSimilarItem,
}) => {
  const navigation = useNavigation();
  const productContext = useContext(pContext);
  const {user, logout} = useContext(UserContext);
  console.log('user', user);
  const addToCarts = defaultItem => {
    debugger;
    async function addToCartApi() {
      const cartResponse = await addToCart(defaultItem);
      if (cartResponse?.code == 200 && cartResponse?.status == 'Success') {
        productContext?.addToCart(defaultItem);

        // Show success snackbar with tick icon
        Snackbar.show({
          text: 'Product added to cart successfully!',
          backgroundColor: 'green',
          // icon: 'check',  // You can use an icon library to add a tick icon here
          // duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        // Show failure snackbar with cross icon
        Snackbar.show({
          text: 'Failed to add product to cart!',
          backgroundColor: 'red',
          // icon: 'close',  // You can use a cross icon for failure
          // duration: Snackbar.LENGTH_SHORT,
        });
      }
    }

    addToCartApi();
  };
  return (
    <ScrollView style={styles.detailsContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: selectedItem?.mainImage}}
          style={styles.selectedImage}
        />
      </View>

      <View style={styles.iconContainer}>
        <Text style={styles.shirtTitle}>{selectedItem?.productCategory}</Text>
        <View style={styles.iconView}>
          <Icon
            name="cart"
            size={30}
            color="gray"
            onPress={() => {
              const defaultItem = {
                id: selectedItem?.id,
                userId: user?.id,
                productId: selectedItem?.productSizeId,
                category: selectedItem?.availabilityId,
                subCategory: selectedItem?.productCategoryId,
                productCategory: selectedItem?.productCategoryId,
                brand: selectedItem?.brandId,
                color: selectedItem?.colorId,
                unit: selectedItem?.unitId,
                productSize:
                  parseFloat(
                    selectedItem?.productSize?.replace(/[^\d.-]/g, ''),
                  ) || 0,
                quantity: 1,
                active: true,
              };

              addToCarts(defaultItem);

              navigation.navigate('Cart', {
                selectedItem,
              });
            }}
          />

          <Icon
            name="share-variant"
            size={30}
            color="gray"
            style={styles.icon}
          />
          <TouchableOpacity onPress={() => toggleFavorite(selectedItem?.id)}>
            <Icon
              name={
                favorites.includes(selectedItem?.id) ? 'heart' : 'heart-outline'
              }
              size={30}
              color={favorites.includes(selectedItem?.id) ? 'red' : 'gray'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.price}>₹{selectedItem?.unitPrice}</Text>
        {/* <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => addToCart(item)}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity> */}
      </View>
      <Text style={styles.sectionTitle}>Product Details:</Text>
      <View style={styles.detailsSection}>
        <Text style={styles.detailsText}>Brand: {selectedItem?.brandName}</Text>
        <Text style={styles.detailsText}>
          Material: {selectedItem?.subCatName}
        </Text>
        <Text style={styles.detailsText}>Product: {selectedItem?.product}</Text>
        <Text style={styles.detailsText}>Color: {selectedItem?.colorName}</Text>
      </View>

      <Text style={styles.sectionTitle}>Product Description:</Text>
      <Text style={styles.descriptionText}>{selectedItem?.description}</Text>

      <Text style={styles.sectionTitle}>Similar Products:</Text>
      <ScrollView
        horizontal
        style={styles.similarItemsContainer}
        showsHorizontalScrollIndicator={false}>
        {similarItem?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectSimilarItem(item)}>
            <View style={styles.card}>
              <Image source={{uri: item?.mainImage}} style={styles.cardImage} />
              <View style={styles.shirtInfo}>
                <Text style={styles.cardTitle}>{item?.productCategory}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Icon
                    name={
                      favorites.includes(item.id) ? 'heart' : 'heart-outline'
                    }
                    size={24}
                    color={favorites.includes(item.id) ? 'red' : '#ccc'}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardPrice}>{item?.unitPrice}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const ProductListView = ({route}) => {
  const navigation = useNavigation();
  const {selectedItem, similarItem} = route.params;

  const [currentItem, setCurrentItem] = useState(selectedItem);
  const [currentSimilarItems, setCurrentSimilarItems] = useState(similarItem);
  const [favoriteItems, setFavoriteItems] = useState([]);

  const handleFavoriteToggle = id => {
    const updatedFavorites = favoriteItems.includes(id)
      ? favoriteItems.filter(item => item !== id)
      : [...favoriteItems, id];
    setFavoriteItems(updatedFavorites);
  };

  const handleSelectSimilarItem = item => {
    setCurrentItem(item);
    setCurrentSimilarItems(
      currentSimilarItems.filter(similar => similar.id !== item.id),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Category')}
          />
          <Text style={styles.headerTitle}>Products</Text>
        </View>

        <View style={styles.headerIcons}>
          <Icon name="magnify" size={24} color="#fff" />
          <Icon name="microphone" size={24} color="#fff" />
          <Icon name="camera" size={24} color="#fff" />
          <Icon
            name="cart"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </View>

      <ProductDetails
        selectedItem={currentItem}
        favorites={favoriteItems}
        toggleFavorite={handleFavoriteToggle}
        similarItem={currentSimilarItems}
        onSelectSimilarItem={handleSelectSimilarItem}
      />
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
  detailsContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    marginBottom: 15,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
  },
  iconView: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  price: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
  shirtTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    padding: 5,
    color: 'black',
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  sizeButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedSize: {
    backgroundColor: '#EDE0D4',
    color: 'white',
  },
  sizeText: {
    fontSize: 16,
    color: 'black',
  },
  detailsSection: {
    marginBottom: 10,
    padding: 5,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
    padding: 5,
    color: 'gray',
  },
  similarItemsContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    gap: 15,
  },
  card: {
    width: 150,
    marginLeft: 10,
    borderWidth: 0,
    borderRadius: 0,
    gap: 10,
  },
  cardImage: {
    width: '100%',
    height: 150,
    marginBottom: 5,
  },
  shirtInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  addToCartButton: {
    backgroundColor: '#703F07',
    borderRadius: 30,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '40%',
    padding: 10,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default ProductListView;
