//@ts-nocheck
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {addToCart, getDetails} from '../Networking/HomePageService';
import {pContext} from '../Context/ProductContext';
import {UserContext} from '../Context/UserContext';
import Snackbar from 'react-native-snackbar';
import SuccessScreen from './SuccessScreen';

const ProductDetails = ({
  selectedItem,
  favorites,
  toggleFavorite,
  similarItem,
  onSelectSimilarItem,
}) => {
  console.log('favorites', favorites);
  console.log('selectedItem', selectedItem);
  const navigation = useNavigation();
  const productContext = useContext(pContext);
  const {user, logout} = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState('');
  console.log('user', user);

  const addToCarts = async defaultItem => {
    try {
      const cartResponse = await addToCart(defaultItem);
      if (cartResponse?.code === 200 && cartResponse?.status === 'Success') {
        productContext?.addToCart(defaultItem);
        Snackbar.show({
          text: 'Product added to cart successfully!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'green',
        });
        setIsAddedToCart(true);
        setShowPopup(true);
        const requestId = defaultItem?.id;
        const userId = user?.id;

        const detailsResponse = await getDetails(requestId, userId);

        if (
          detailsResponse?.code === 200 &&
          detailsResponse?.status === 'Success'
        ) {
          console.log('Details retrieved successfully:', detailsResponse);
        } else {
          throw new Error('Failed to retrieve product details');
        }

        setTimeout(() => {
          navigation.navigate('Cart', {
            selectedItem,
          });
        }, 2000);
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      Snackbar.show({
        text: error?.message || 'Something went wrong!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });

      setShowPopup(false);
    }
  };
  const handleMouseMove = e => {
    // Implement logic for mouse move handling here if needed.
  };

  const handleFavoriteToggle = item => {
    const favoriteObject = {
      userId: user?.id || 0,
      productId: item?.id || 0,
      category: item?.availabilityId || 0,
      subCategory: item?.productCategoryId || 0,
      productCategory: item?.productCategoryId || 0,
      brand: item?.brandId || 0,
      color: item?.colorId || 0,
      unit: item?.unitId || 0,
      productSize: parseFloat(item?.productSize?.replace(/[^\d.-]/g, '')) || 0,
    };

    if (isFavorite) {
      productContext?.removeFromFavorite(favoriteObject);
    } else {
      productContext?.addToFavorite(favoriteObject);
    }

    setIsFavorite(prevState => !prevState);
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
          <TouchableOpacity
            onPress={() => {
              const defaultItem = {
                id: selectedItem?.id,
                userId: user?.id,
                productId: selectedItem?.id,
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
            }}>
            {isAddedToCart ? (
              <Icon name="cart-check" size={30} color="green" />
            ) : (
              <Icon name="cart" size={30} color="gray" />
            )}
          </TouchableOpacity>

          <Icon
            name="share-variant"
            size={30}
            color="gray"
            style={styles.icon}
          />
          <TouchableOpacity onPress={() => handleFavoriteToggle(selectedItem)}>
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={30}
              color={isFavorite ? 'red' : 'gray'}
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
      <View style={styles.containers}>
        <View style={styles.headers}>
          <Text style={styles.title}>Review Product</Text>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[...Array(5)].map((_, index) => {
              const isHalf = 'rating > index && rating < index + 1';
              const isFull = 'rating >= index + 1';
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.starWrapper}
                  onPress={() => handleStarClick(index, handleMouseMove)}
                  onMouseMove={handleMouseMove}>
                  <Icon
                    name="star"
                    size={30}
                    color={isFull || isHalf ? '#FFD700' : '#B0B0B0'}
                  />
                  {isHalf && (
                    <Icon
                      name="star-half"
                      size={30}
                      color="#FFD700" // Half star color
                      style={styles.starOverlay}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
        </View>

        <Text style={styles.feedbackText}>
          Share your thoughts,{' '}
          <Text style={styles.userName}>{'userData.name'}!</Text> We'd love to
          hear your feedback on this product.
        </Text>

        <TextInput
          style={styles.textarea}
          multiline
          numberOfLines={4}
          placeholder="Add your comments here..."
          value={comment}
          onChangeText={text => setComment(text)}
        />

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            // onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>

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
                <TouchableOpacity
                  onPress={() => handleFavoriteToggle(selectedItem)}>
                  <Icon
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={30}
                    color={isFavorite ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardPrice}>{item?.unitPrice}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* {showPopup && (
        <SuccessScreen />
      )} */}
    </ScrollView>
  );
};

const ProductListView = ({route}) => {
  const navigation = useNavigation();
  const {selectedItem, similarItem} = route.params;

  const [currentItem, setCurrentItem] = useState(selectedItem);
  const [currentSimilarItems, setCurrentSimilarItems] = useState(similarItem);
  const [favoriteItems, setFavoriteItems] = useState([]);

  const toggleFavorite = item => {
    const isFavorite = favoriteItems.some(
      fav => fav.productId === item.productId,
    );

    if (isFavorite) {
      setFavoriteItems(prevFavorites =>
        prevFavorites.filter(fav => fav.productId !== item.productId),
      );
    } else {
      setFavoriteItems(prevFavorites => [...prevFavorites, item]);
    }
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
        toggleFavorite={toggleFavorite}
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
  containers: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headers: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter', // Ensure you have this font or replace with your choice
    fontWeight: '600',
    color: '#5D3A00', // Dark brown color
    textAlign: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  stars: {
    flexDirection: 'row',
    gap: 10,
  },
  starWrapper: {
    position: 'relative',
    width: 30,
    height: 30,
    cursor: 'pointer',
  },
  starIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#B0B0B0', // Gray color for the empty star
  },
  starFull: {
    tintColor: '#FFD700', // Full star color
  },
  starOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#FF0000', // Red color for error messages
    fontSize: 12,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 8,
    color: '#333',
    textAlign: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5D3A00',
  },
  textarea: {
    width: '100%',
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  submitButtonContainer: {
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#5D3A00', // Dark brown color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProductListView;
