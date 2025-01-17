//@ts-nocheck
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
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
import uuid from 'react-native-uuid';
import ToastMessage from './toast_message/toast_message';
import SignUpScreen from './SignUp';
import LoginScreen from './Login';

const ProductDetails = ({
  selectedItem,
  favorites,
  toggleFavorite,
  similarItem,
  onSelectSimilarItem,
}) => {
  console.log('selectedItem', selectedItem);
  const shouldRenderReviews = true;
  const navigation = useNavigation();

  //state management
  const [rating, setRating] = useState(0);
  const productContext = useContext(pContext);
  const {user, logout} = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState('');
  const [ratingsFetched, setRatingsFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showToastFailure, setShowToastFailure] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddFailure, setShowAddFailure] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteFailure, setShowDeleteFailure] = useState(false);
  const scrollViewRef = useRef(null);
  const targetViewRef = useRef(null);
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [showAddFavoriteFailure, setShowAddFavoriteFailure] = useState(false);
  const [showRemoveFavorite, setShowRemoveFavorite] = useState(false);
  const [showRemoveFavoriteFailure, setShowRemoveFavoriteFailure] =
    useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  //useEffect
  useEffect(() => {
    const requestId = selectedItem?.productId;
    const userId = user?.id;
    if (requestId && userId && !ratingsFetched) {
      fetchRating(requestId, userId);
      setRatingsFetched(true);
    }
  }, [selectedItem, user]);

  const scrollToTarget = () => {
    targetViewRef?.current?.measure((fx, fy, width, height, px, py) => {
      console?.log(fx, fy, width, height, px, py, 'from target Ref');
      scrollViewRef?.current?.scrollTo({
        x: 0,
        y: -py + 70,
        animated: true,
      });
    });
  };

  const scrollToTop = () => {
    scrollViewRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const addToCarts = async defaultItem => {
    if (!user) {
      console.log('User not logged in! Please log in to continue.');
      setShowPopup(false);
      setShowSignIn(true);
      return;
    }

    try {
      const cartResponse = await addToCart(defaultItem);

      if (cartResponse?.code === 200 && cartResponse?.status === 'Success') {
        productContext?.addToCart(defaultItem);
        setShowToast(true);
        setShowToastFailure(false);
        setIsAddedToCart(true);
        setShowPopup(true);

        const requestId = defaultItem?.id;
        const userId = user?.id;

        try {
          const detailsResponse = await getDetails(requestId, userId);

          if (
            detailsResponse?.code === 200 &&
            detailsResponse?.status === 'Success'
          ) {
            console.log('Details retrieved successfully:', detailsResponse);
          } else {
            console.warn(
              'Failed to retrieve product details:',
              detailsResponse,
            );
          }
        } catch (detailsError) {
          console.error('Error retrieving product details:', detailsError);
        }
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      setShowToast(false);
      setShowToastFailure(true);
      setShowPopup(false);
    }
  };

  const handleStarClick = index => {
    setRating(index + 1);
  };
  const handleEdit = review => {
    setEditingItemId(review?.id);
    setComment(review?.comments);
    setRating(review?.rating);
  };
  const handleSubmit = async () => {
    try {
      let requestId = selectedItem?.id || selectedItem?.productId;
      let userId = user?.id;
      const ratingData = {
        productId: requestId,
        rating: rating,
        comments: comment,
        userId: userId,
      };

      if (editingItemId) {
        ratingData.id = editingItemId;
      }

      try {
        let response;
        if (editingItemId) {
          response = await editProductRating(ratingData);
        } else {
          response = await addProductRating(ratingData);
        }

        console.log('Full Response:', response);

        if (response) {
          productContext?.fetchRatings(requestId, userId);
          setRating(0);
          setComment('');
          setShowAdd(true);
          setShowAddFailure(false);
          console.log('Rating added successfully!');
        }
      } catch (error) {
        let _error = error;
        console.error('Error submitting rating:', _error);
        console.log('Failed to submit rating');
        setShowAdd(false);
        setShowAddFailure(true);
      }
    } catch (error) {
      let _error = error;
      console.log(_error);
      setShowAdd(false);
      setShowAddFailure(true);
      console.log('Failed to submit rating');
    }
  };
  const fetchRating = async (requestId, userId) => {
    const response = await productContext?.fetchRatings(requestId, userId);

    if (response) {
      setRatingsFetched(true);
    }
  };

  const handleFavoriteToggle = async item => {
    if (!user?.id) {
      setShowSignIn(true);
      return;
    }
    let favouriteAddObject = {
      userId: String(user?.id),
      productId: item?.id || item?.productId || 0,
      category: item?.categoryId || 0,
      subCategory: item?.subCategoryId || 0,
      productCategory: item?.productCategoryId || 0,
      brand: item?.brandId || 0,
      color: item?.colorId || 0,
      unit: item?.unitId || 0,
      productSize: item?.sizeId || 0,
    };
    let favouriteRemoveObject = {
      userId: String(user?.id),
      productId: item?.id || item?.productId || 0,
    };

    try {
      if (item?.favourite) {
        let removeFavResponse = await productContext?.removeFromFavorite(
          favouriteRemoveObject,
        );
        if (removeFavResponse) {
          onSelectSimilarItem(item);
          setShowRemoveFavorite(true);
          setShowRemoveFavoriteFailure(false);
        }
      } else {
        let addFavResponse = await productContext?.addToFavorite(
          favouriteAddObject,
        );
        if (addFavResponse) {
          onSelectSimilarItem(item);
          setShowAddFavorite(true);
          setShowAddFavoriteFailure(false);
        }
      }
    } catch (error) {
      console.error('Error handling favorite toggle:', error);
      setShowAddFavorite(false);
      setShowRemoveFavorite(false);
      setShowAddFavoriteFailure(true);
      setShowRemoveFavoriteFailure(true);
    }
  };

  const handleViewMore = () => {
    setShowAllReviews(true);
    setVisibleReviews(productContext?.ratings?.length || 0);
  };

  const handleDelete = async item => {
    const requestId = item?.id;
    const itemId = selectedItem?.productId;
    const userId = item?.userId;

    try {
      const response = await deleteProductRating({requestId, userId});

      if (response?.code === 200 && response?.status === 'Success') {
        productContext?.fetchRatings(itemId, userId);
        setShowDelete(true);
        setShowDeleteFailure(false);
        console.log('Review deleted successfully!');
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setShowDeleteFailure(true);
      setShowDelete(false);
    }
  };

  const navigateToCart = () => {
    navigation.navigate('Cart', {
      selectedItem,
    });
  };
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };
  const regex = /(<([^>]+)>|&nbsp;)/gi;
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      {(showToast || showToastFailure) && (
        <ToastMessage
          text1Press={() => {}}
          text2Press={() => {
            if (!showToastFailure) {
              navigateToCart();
            } else {
              navigateToLogin();
            }
          }}
          text1={
            showToastFailure ? 'Something went wrong' : 'Item added to cart'
          }
          text2={showToastFailure ? 'Login or failed' : 'Go to cart'}
          setToast={() => {
            setShowToast(false);
            setShowToastFailure(false);
          }}
        />
      )}
      {(showDelete || showDeleteFailure) && (
        <ToastMessage
          text1Press={() => {}}
          text2Press={() => {}}
          text1={
            showDeleteFailure
              ? 'Something went wrong'
              : 'Review deleted sucessfully'
          }
          text2={''}
          setToast={() => {
            setShowDelete(false);
            setShowDeleteFailure(false);
          }}
        />
      )}
      {(showAddFavorite ||
        showAddFavoriteFailure ||
        showRemoveFavorite ||
        showRemoveFavoriteFailure) && (
        <ToastMessage
          text1Press={() => {}}
          text2Press={() => {}}
          text1={
            showAddFavorite
              ? 'Item added to favorites!'
              : showRemoveFavorite
              ? 'Item removed from favorites!'
              : showAddFavoriteFailure
              ? 'Error adding item to favorites.'
              : 'Error removing item from favorites.'
          }
          text2={''}
          setToast={() => {
            setShowAddFavorite(false);
            setShowAddFavoriteFailure(false);
            setShowRemoveFavorite(false);
            setShowRemoveFavoriteFailure(false);
          }}
        />
      )}
      {(showAdd || showAddFailure) && (
        <ToastMessage
          text1Press={() => {}}
          text2Press={() => {}}
          text1={
            showAddFailure ? 'Something went wrong' : 'Review added sucessfully'
          }
          text2={''}
          setToast={() => {
            setShowAdd(false);
            setShowAddFailure(false);
          }}
        />
      )}
      <ScrollView
        ref={scrollViewRef}
        style={styles.detailsContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: selectedItem?.image}}
            style={styles.selectedImage}
          />
        </View>

        <View style={styles.iconContainer}>
          <Text style={styles.productTitle}>{selectedItem?.productName}</Text>
          <View style={styles.iconView}>
            <TouchableOpacity
              onPress={() => {
                const defaultItem = {
                  id: selectedItem?.id || selectedItem?.productId,
                  userId: user?.id,
                  productId: selectedItem?.id || selectedItem?.productId,
                  category:
                    selectedItem?.availabilityId || selectedItem?.categoryId,
                  subCategory: selectedItem?.productCategoryId,
                  productCategory: selectedItem?.productCategoryId,
                  brand: selectedItem?.brandId,
                  color: selectedItem?.colorId,
                  unit: selectedItem?.unitId,
                  productSize:
                    parseFloat(
                      selectedItem?.productSize?.replace(/[^\d.-]/g, ''),
                    ) ||
                    selectedItem?.size?.replace(/[^\d.-]/g, '') ||
                    0,
                  quantity: 1,
                  active: true,
                };
                addToCarts(defaultItem);
              }}>
              {isAddedToCart ? (
                <Icon name="cart-check" size={24} color="green" />
              ) : (
                <Icon name="cart" size={24} color="gray" />
              )}
            </TouchableOpacity>
            <MaterialIcon
              name="share"
              size={24}
              color="gray"
              style={styles.icon}
            />
            <TouchableOpacity
              onPress={() => handleFavoriteToggle(selectedItem)}>
              <Icon
                name={selectedItem?.favourite ? 'heart' : 'heart-outline'}
                size={24}
                color={selectedItem?.favourite ? 'red' : 'gray'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 5,
          }}>
          <Text style={styles.price}>₹{selectedItem?.unitPrice}</Text>
        </View>

        <View style={styles.ratingBox}>
          <Icon name="star" size={26} color={'gray'} />
          <Text style={styles.ratingText}>
            {selectedItem?.rating}
            {/* {productContext &&
            productContext?.ratings &&
            productContext?.ratings?.length > 0
              ? productContext?.ratings[productContext?.ratings?.length - 1]
                  ?.rating || 0.0
              : 0.0} */}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Product Details:</Text>
        <View style={styles.detailsSection}>
          <Text style={styles.detailsText}>
            Brand: {selectedItem?.brandName}
          </Text>
          <Text style={styles.detailsText}>
            Category: {selectedItem?.subCategoryName}
          </Text>
          <Text style={styles.detailsText}>
            Product: {selectedItem?.productName}
          </Text>
          <Text style={styles.detailsText}>
            Color: {selectedItem?.colorName}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Product Description:</Text>
        <Text style={styles.descriptionText}>
          {selectedItem?.description?.replace(regex, '')}
        </Text>
        <View style={styles.containers} collapsable={false} ref={targetViewRef}>
          <View style={styles.headers}>
            <Text style={styles.title}>Review Product</Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[...Array(5)]?.map((_, index) => {
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
          {productContext?.ratings && productContext?.ratings?.length > 0 ? (
            productContext?.ratings
              ?.slice(
                0,
                showAllReviews
                  ? productContext?.ratings?.length
                  : visibleReviews,
              )
              ?.map(item => (
                <View key={item?.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.username}>{item.username}</Text>
                    <View style={styles.stars}>
                      {Array.from({length: item?.rating})?.map((_, index) => (
                        <Icon
                          key={index}
                          name="star"
                          size={16}
                          color="#78350f"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.comment}>
                    {item?.comments || 'No comment'}
                  </Text>
                  {item?.userId === user?.id && (
                    <View style={styles.commentActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                          scrollToTarget();
                          handleEdit(item);
                        }}>
                        <Icon
                          name="square-edit-outline"
                          size={20}
                          color="gray"
                        />
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
        {productContext?.ratings?.length > visibleReviews &&
          !showAllReviews && (
            <View style={styles.viewMoreButtonContainer}>
              <TouchableOpacity
                onPress={handleViewMore}
                style={styles.viewMoreButton}>
                <Text style={styles.viewMoreButtonText}>View More</Text>
              </TouchableOpacity>
            </View>
          )}
        <Text style={styles.sectionTitle}>Similar Products:</Text>
        <FlatList
          data={similarItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.similarItemsContainer}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                onSelectSimilarItem(item);
                scrollToTop();
              }}>
              <View style={styles.card}>
                <Image
                  source={{
                    uri:
                      item?.productImage ||
                      item?.productImages?.[0] ||
                      'https://via.placeholder.com/150',
                  }}
                  style={styles.cardImage}
                />
                <View style={styles.productInfo}>
                  <Text
                    style={styles.cardTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item?.productName}
                  </Text>
                </View>
                <Text style={styles.cardPrice}>
                  Rs. {item?.price?.toLocaleString('en-IN')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSignIn || showRegister}
        onRequestClose={() => {}}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: 'white',
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            paddingBottom: 24,
            flex: 0.7,
          }}>
          <View style={{flex: 1, position: 'relative'}}>
            <Pressable
              style={{
                height: 50,
                width: 50,
                backgroundColor: 'white',
                borderRadius: 25,
                top: -55,
                left: '87%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setShowSignIn(false);
                setShowRegister(false);
              }}>
              <Icon size={24} name="close" />
            </Pressable>
            {showRegister ? (
              <SignUpScreen
                page="modal_layout"
                setShowRegister={setShowRegister}
                setShowSignIn={setShowSignIn}
              />
            ) : (
              <LoginScreen
                page="modal_layout"
                setShowRegister={setShowRegister}
                setShowSignIn={setShowSignIn}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const ProductListView = ({route}) => {
  const navigation = useNavigation();
  const {selectedItem, similarItem} = route.params;
  const [currentItem, setCurrentItem] = useState({});
  const user_context = useContext(UserContext);
  let userInfo = user_context?.user;
  async function getProductDetails(productId, userId) {
    let productDetails = await getDetails(
      String(productId),
      String(userId || 0),
    );
    setCurrentItem(productDetails?.data);
  }
  useEffect(() => {
    getProductDetails(selectedItem?.id, userInfo?.id);
  }, [selectedItem]);
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
    getProductDetails(item?.id || item?.productId, userInfo?.id);
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
          {/* <Icon name="magnify" size={24} color="#fff" />
          <Icon name="microphone" size={24} color="#fff" />
          <Icon name="camera" size={24} color="#fff" /> */}
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
        similarItem={currentItem?.similarProducts}
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
    padding: 15,
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
    paddingLeft: 10,
    paddingRight: 10,
  },
  iconView: {
    flexDirection: 'row',
    gap: 4,
  },
  price: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    width: 230,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingLeft: 10,
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
    paddingLeft: 10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 10,
    color: 'gray',
    marginRight: 12,
  },

  similarItemsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    width: 180,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#703F07',
    padding: 5,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
