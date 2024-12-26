//@ts-nocheck
import React, {useContext, useEffect, useState} from 'react';
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
import {
  addProductRating,
  addToCart,
  deleteProductRating,
  editProductRating,
  getDetails,
  getProductRating,
} from '../Networking/HomePageService';
import {pContext, ProductContext} from '../Context/ProductContext';
import {UserContext} from '../Context/UserContext';
import Snackbar from 'react-native-snackbar';
import SuccessScreen from './SuccessScreen';
import CustomerReviews from './Reviews';

const ProductDetails = ({
  selectedItem,
  favorites,
  toggleFavorite,
  similarItem,
  onSelectSimilarItem,
}) => {
  const shouldRenderReviews = true;
  console.log('favorites', favorites);
  console.log('selectedItem', selectedItem);
  const navigation = useNavigation();
  const [rating, setRating] = useState(0);
  const productContext = useContext(pContext);
  const {user, logout} = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState('');
  console.log('user', user);
  console.log('productContext?.ratings', productContext?.ratings);
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

  const handleStarClick = index => {
    setRating(index + 1);
  };
  const handleEdit = review => {
    setEditingItemId(review.id);
    setComment(review.comments);
    setRating(review.rating);
  };
  const handleSubmit = async () => {
    const ratingData = {
      id: selectedItem?.id,
      productId: selectedItem?.id,
      rating: rating,
      comments: comment,
      userId: user?.id,
    };

    try {
      let response;
      if (editingItemId) {
        response = await editProductRating(ratingData);
      } else {
        response = await addProductRating(ratingData);
      }

      console.log('Full Response:', response);

      if (response) {
        if (editingItemId) {
          console.log('Editing item with ID:', editingItemId);

          productContext?.setRatings(prevRatings =>
            prevRatings.map(review => {
              if (review.id === editingItemId) {
                console.log('Updating rating:', {...review, ...response});
                return {...review, ...response};
              }
              return review;
            }),
          );
        } else {
          productContext?.setRatings(prevRatings => [...prevRatings, response]);
          Snackbar.show({
            text: response.message || 'Rating added successfully!',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'green',
          });
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);

      Snackbar.show({
        text: `Failed to submit rating: ${error?.message}`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }
  };

  useEffect(() => {
    const fetchRating = async (requestId, userId) => {
      try {
        console.log('Fetching ratings with:', {requestId, userId});

        const response = await getProductRating({requestId, userId});
        console.log('API Response:', response);

        const ratingsArray = response?.data?.ratings;

        if (Array.isArray(ratingsArray)) {
          console.log('Setting Ratings:', ratingsArray);
          productContext?.fetchRatings(ratingsArray);
        } else {
          console.warn(
            'Unexpected data format, resetting to empty array:',
            ratingsArray,
          );
          productContext?.fetchRatings([]);
        }
      } catch (error) {
        console.error(
          'Error fetching ratings:',
          error?.response || error?.message || error,
        );
        productContext?.fetchRatings([]);
      }
    };

    const requestId = selectedItem?.id;
    const userId = user?.id;

    if (requestId && userId) {
      fetchRating(requestId, userId);
    }
  }, [selectedItem, user]);
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
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleViewMore = () => {
    setShowAllReviews(true);
    setVisibleReviews(productContext?.ratings?.length || 0);
  };
  const [editingItemId, setEditingItemId] = useState(null);

  const handleDelete = async item => {
    const requestId = item?.id;
    const userId = item?.userId;

    try {
      const response = await deleteProductRating({requestId, userId});

      if (response?.code === 200 && response?.status === 'Success') {
        const updatedRatings = productContext?.ratings.filter(
          review => review.id !== requestId,
        );

        productContext?.setRatings(updatedRatings);

        Snackbar.show({
          text: 'Review deleted successfully!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'green',
        });
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);

      Snackbar.show({
        text: error?.message || 'Something went wrong!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }
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
      </View>

      <View style={styles.ratingBox}>
        <Icon name="star" size={26} color={'gray'} />
        <Text style={styles.ratingText}>
          {productContext &&
          productContext.ratings &&
          productContext.ratings.length > 0
            ? productContext.ratings[productContext.ratings.length - 1]
                ?.rating || 0.0
            : 0.0}
        </Text>
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
              const isFull = rating >= index + 1;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.starWrapper}
                  onPress={() => handleStarClick(index)}>
                  <Icon
                    name="star"
                    size={30}
                    color={isFull ? '#FFD700' : '#B0B0B0'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={styles.feedbackText}>
          Share your thoughts,{' '}
          <Text style={styles.userName}>{user?.name}!</Text> We'd love to hear
          your feedback on this product.
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
            onPress={() => handleSubmit(selectedItem)}>
            <Text style={styles.submitButtonText}>
              {editingItemId ? 'Update Review' : 'Submit Review'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.titles}>Customer Reviews</Text>
      <ScrollView
        style={[styles.reviewContainer, {maxHeight: 500}]}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        {productContext?.ratings && productContext?.ratings.length > 0 ? (
          productContext?.ratings
            .slice(
              0,
              showAllReviews ? productContext?.ratings?.length : visibleReviews,
            )
            .map(item => (
              <View key={item.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.username}>{item.username}</Text>
                  <View style={styles.stars}>
                    {Array.from({length: item.rating}).map((_, index) => (
                      <Icon key={index} name="star" size={16} color="#78350f" />
                    ))}
                  </View>
                </View>
                <Text style={styles.comment}>
                  {item?.comments || 'No comment'}
                </Text>
                {item.userId === user?.id && (
                  <View style={styles.commentActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEdit(item)}>
                      <Icon name="square-edit-outline" size={20} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(item)}>
                      <Icon name="delete-outline" size={20} color="gray" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
        ) : (
          <Text style={styles.noReviewsText}>No reviews yet.</Text>
        )}
      </ScrollView>
      {productContext?.ratings?.length > visibleReviews && !showAllReviews && (
        <View style={styles.viewMoreButtonContainer}>
          <TouchableOpacity
            onPress={handleViewMore}
            style={styles.viewMoreButton}>
            <Text style={styles.viewMoreButtonText}>View More</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#5D3A00',
    textAlign: 'center',
  },
  titles: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    marginBottom: 16,
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
    tintColor: '#B0B0B0',
  },
  starFull: {
    tintColor: '#FFD700',
  },
  starOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#FF0000',
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
    backgroundColor: '#5D3A00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  resetButton: {
    right: 10,
    top: 5,
  },
  resetButtons: {
    right: 10,
    top: 5,
  },
  deleteIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    paddingVertical: 8,
    paddingHorizontal: 17,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    borderColor: '#5D3A00',
    backgroundColor: '#5D3A00',
  },
  editButton: {
    borderColor: '#5D3A00',
    backgroundColor: '#5D3A00',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  ratingBox: {
    backgroundColor: '#d3f9d8',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: 70,
    marginLeft: 5,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginRight: 15,
  },
  reviewContainer: {
    maxHeight: 600,
    overflowY: 'auto',
  },
  reviewCard: {
    flexDirection: 'column',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e2a00',
    marginRight: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b6b6b',
  },
  comment: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6b6b6b',
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#888',
  },
  viewMoreButtonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  viewMoreButton: {
    backgroundColor: '#78350f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  viewMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  editButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
});

export default ProductListView;
