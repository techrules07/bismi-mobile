//@ts-nocheck
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryForMens from '../Blocks/Category/CategoryForMens';
import {
  getAllCategories,
  getAllOffers,
  getAllPremiumProducts,
  getAllProducts,
  getNewArrivalProducts,
} from '../Networking/HomePageService';
import {pContext} from '../Context/ProductContext';
import {useNavigation} from '@react-navigation/native';
import Loader from './Loader';
import {UserContext} from '../Context/UserContext';
import themeConfig from '../assets/themes/themeConfig';

const Category = props => {
  //usestate management
  const [selectedSection, setSelectedSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const productContext = useContext(pContext);
  const userContext = useContext(UserContext);
  let userInfo = userContext?.user;
  console.log(UserContext, 'from category');

  //useEffect
  useEffect(() => {
    fetchData();
  }, []);

  //function handling
  const handleSidebarClick = async (categoryId, userId) => {
    setSelectedSection(categoryId);
    getProducts(categoryId, userId);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAllOffers(),
        getAllCategoriesApi(),
        getProducts(1, userInfo?.id),
        getPremiumProductsApi(),
        getNewArrivalApi(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOffers = async () => {
    const response = await getAllOffers();
    if (response?.status === 200 && response?.data?.code === 200) {
      productContext?.updateSliderItems(response?.data?.data);
    }
  };

  const getPremiumProductsApi = async () => {
    try {
      const response = await getAllPremiumProducts();
      if (response?.status === 200 && response?.data?.code === 200) {
        productContext?.updatePremiumProducts(response?.data?.data);
      }
    } catch (error) {
      console.error('Failed to fetch premium products:', error);
    }
  };

  const getNewArrivalApi = async () => {
    try {
      const response = await getNewArrivalProducts();
      if (response?.status === 200 && response?.data?.code === 200) {
        productContext?.updateNewArrival(response?.data?.data);
      }
    } catch (error) {
      console.error('Failed to fetch arrival products:', error);
    }
  };

  const getAllCategoriesApi = async () => {
    const categoriesResponse = await getAllCategories();
    if (
      categoriesResponse?.status === 200 &&
      categoriesResponse?.data?.code === 200
    ) {
      productContext?.updateCategories(categoriesResponse.data.data);
    }
  };

  const getProducts = async (categoryId, userId) => {
    try {
      const productsListResponse = await getAllProducts(categoryId, userId);
      if (
        productsListResponse?.status === 200 &&
        productsListResponse?.data?.code === 200
      ) {
        productContext.updateProductList(
          productsListResponse?.data?.data?.listAllProductItems,
        );
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  console.log('categories', productContext?.categories);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
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
      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.sidebarContainer}>
            <ScrollView
              style={styles.sidebar}
              contentContainerStyle={styles.sidebarContent}
              showsVerticalScrollIndicator={false}>
              {productContext?.categories?.map(category => (
                <View
                  key={category.id}
                  style={[
                    styles.sidebarItem,
                    selectedSection === category?.id &&
                      styles.activeSidebarItem,
                  ]}
                  onTouchEnd={() =>
                    handleSidebarClick(category?.id, userInfo?.id)
                  }>
                  <Image
                    source={{uri: category?.imageURL}}
                    style={[
                      selectedSection === category?.id
                        ? styles.roundedImages
                        : styles.sidebarIcon,
                      {backgroundColor: 'transparent'},
                    ]}
                  />
                  <Text style={styles.sidebarText}>
                    {category?.categoryName}
                  </Text>
                  <View
                    style={
                      selectedSection === category?.id
                        ? styles.selectedStyle
                        : styles.horizontalLine
                    }
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          {selectedSection && (
            <ScrollView style={styles.mainContent}>
              <Text style={styles.sectionTitle}>List of Category</Text>
              <ScrollView
                horizontal
                style={styles.horizontalScroll}
                showsHorizontalScrollIndicator={false}>
                {productContext?.productList?.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recentItem}
                    onPress={() =>
                      navigation.navigate('ProductListView', {
                        selectedItem: item,
                        similarItem: productContext?.productList?.filter(
                          otherItem => otherItem?.id !== item?.id,
                        ),
                      })
                    }>
                    <Image
                      source={{uri: item?.mainImage}}
                      style={styles.recentImage}
                    />
                    <Text style={styles.recentText} numberOfLines={1}>
                      {item?.product}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.sectionTitle}>More Offers</Text>
              <ScrollView
                horizontal
                style={styles.horizontalScroll}
                showsHorizontalScrollIndicator={false}>
                {productContext?.sliderItems?.map(item => (
                  <View key={item.id} style={styles.recentItem}>
                    <Image
                      source={{uri: item?.offerImage}}
                      style={styles.roundedImage}
                    />
                    <Text style={styles.recentText}>{item?.offerName}</Text>
                  </View>
                ))}
              </ScrollView>
              <Text style={styles.sectionTitle}>New Launch</Text>
              <ScrollView
                horizontal
                style={styles.horizontalScroll}
                showsHorizontalScrollIndicator={false}>
                {productContext?.newArrival?.map(item => (
                  <View key={item.id} style={styles.recentItem}>
                    <Image
                      source={{uri: item?.mainImageUrl}}
                      style={styles.roundedImage}
                    />
                    <Text style={styles.recentText}>{item?.productName}</Text>
                  </View>
                ))}
              </ScrollView>
              <Text style={styles.sectionTitle}>Premium Category</Text>
              <ScrollView
                horizontal
                style={styles.horizontalScroll}
                showsHorizontalScrollIndicator={false}>
                {productContext?.premiumProducts?.map(store => (
                  <View key={store.id} style={styles.gridItem}>
                    <Image
                      source={{
                        uri:
                          store?.mainImageUrl ||
                          'https://via.placeholder.com/150',
                      }}
                      style={styles.gridImage}
                    />
                    <View style={styles.gridText}>
                      <Text style={styles.gridTitle}>
                        {store?.subCategoryName}
                      </Text>
                      <Text style={styles.gridPrice}>
                        ₹{store?.unitPrice?.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#703F07',
  },
  headers: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},

  headerIcons: {flexDirection: 'row', gap: 15},
  content: {flexDirection: 'row', flex: 1},

  sidebar: {
    backgroundColor: '#EDE0D4',
    maxWidth: 70,
    borderRadius: 10,
    borderTopRadius: 10,
    marginTop: 10,
  },
  sidebarContent: {
    paddingBottom: 10,
  },
  activeSidebarItem: {
    backgroundColor: 'white',
    borderLeftWidth: 5,
    marginLeft: 1,
  },

  sidebarItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: 70,
    maxWidth: 70,
  },
  sidebarIcon: {width: 40, height: 40},
  sidebarText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    color: '#703F07',
  },
  mainContent: {flex: 1, padding: 10},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#703F07',
    marginLeft:10
  },
  horizontalScroll: {
    paddingHorizontal: 10,
  },
  gridItem: {
    width: 150,
    marginRight: 10,
    backgroundColor: '#EDE0D4',
    borderRadius: 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    marginVertical: 2,
    marginBottom:100
  },
  gridImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  gridText: {
    padding: 10,
    alignItems: 'center',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: 'center',
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#703F07',
  },
  recentItem: {marginRight: 10, alignItems: 'center'},
  recentImage: {width: 80, height: 80, borderRadius: 8},
  recentText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    width: 100,
  },
  roundedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  roundedImages: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  forYouSection: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forYouTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: '#703F07',
  },
  horizontalLine: {
    width: '70%',
    height: 1,
    backgroundColor: '#703F07',
    marginTop: 10,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 400,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default Category;
