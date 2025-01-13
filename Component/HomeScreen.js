import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import Logo from '../assets/logo-bismi.png';
import Search from '../assets/search.png';
import {getAllOffers, getAllCategories} from '../Networking/HomePageService';
import {pContext} from '../Context/ProductContext';
import Carousel from 'react-native-reanimated-carousel';
import Loader from './Loader';
import themeConfig from '../assets/themes/themeConfig';

const HomeScreen = props => {
  const productContext = useContext(pContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const width = Dimensions.get('window').width;
  const handleSearch = text => {
    if (typeof text === 'string') {
      setSearchQuery(text);
    }
  };
  let filteredProducts = [];
  if (searchQuery) {
    let search_query = searchQuery?.toLowerCase()?.trim();
    filteredProducts = Array.isArray(productContext?.categories)
      ? productContext?.categories.filter(product =>
          product?.categoryName?.toLowerCase()?.includes(search_query),
        )
      : [];
  }
  const productsToDisplay = searchQuery
    ? filteredProducts
    : productContext?.categories || [];
  useEffect(() => {
    async function fetchData() {
      try {
        const [offersResponse, categoriesResponse, homeResponse] =
          await Promise.all([
            getAllOffers(),
            getAllCategories(),
            getAllCategories(),
          ]);

        if (offersResponse.status === 200 && offersResponse.data.code === 200) {
          productContext.updateSliderItems(offersResponse.data.data);
        }

        if (
          categoriesResponse.status === 200 &&
          categoriesResponse.data.code === 200
        ) {
          productContext.updateCategories(categoriesResponse.data.data);
        }

        if (homeResponse.status === 200 && homeResponse.data.code === 200) {
          productContext.updateHomeItems(homeResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: themeConfig.appPrimary}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingVertical: 16,
          width: '100%',
          backgroundColor: themeConfig.appPrimary,
          paddingBottom: 40,
        }}>
        <View style={{}}>
          <Image source={Logo} />
        </View>

        <View
          style={{
            backgroundColor: themeConfig.appBackground,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 16,
            borderRadius: 20,
            width: '80%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
          }}>
          <Image source={Search} style={{width: 15, height: 15}} />

          <TextInput
            placeholder="Search product"
            value={searchQuery}
            onChangeText={handleSearch}
            style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 10}}
          />
        </View>
      </View>

      <View
        style={{
          flex: 1,
          borderTopRightRadius: 16,
          backgroundColor: themeConfig.appBackground,
          borderTopLeftRadius: 16,
        }}>
        <ScrollView
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <Loader />
            </View>
          ) : (
            <View
              style={{
                // flex: 1,
                width: '100%',
                // borderTopRightRadius: 16,
                // borderTopLeftRadius: 16,
                // padding: 16,
                // height: 800,
              }}>
              <View style={{width: '100%', padding: 16}}>
                {productContext?.sliderItems.length > 0 && (
                  <Carousel
                    width={width - 30}
                    height={160}
                    data={productContext.sliderItems}
                    scrollAnimationDuration={1000}
                    autoPlay={true}
                    autoPlayInterval={1000}
                    renderItem={item => {
                      return (
                        <View style={{height: 160, width: '100%'}}>
                          {item.item.offerImage != null ? (
                            <Image
                              source={{uri: item.item.offerImage}}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 8,
                              }}
                            />
                          ) : (
                            <Text>Text element</Text>
                          )}
                        </View>
                      );
                    }}
                  />
                )}
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  flexWrap: 'wrap',
                  marginTop: 16,
                }}>
                {productsToDisplay?.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      flexBasis: '30%',
                      // height: 80,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                    onPress={() =>
                      props.navigation.navigate('Products', {
                        categoryId: item.id,
                      })
                    }>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                      }}>
                      <Image
                        source={{uri: item.imageURL}}
                        style={styles.roundedImage}
                      />
                      <Text
                        style={{
                          fontWeight: '500', // Fix for React Native fontWeight
                          fontSize: 12,
                          color: themeConfig.appPrimary,
                          marginTop: 4,
                        }}>
                        {item.categoryName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{}}>
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
              </View>
              <View style={{}}>
                <Text style={styles.sectionTitle}>Explore</Text>
                <ScrollView
                  style={styles.horizontalScroll}
                  horizontal={true}
                  contentContainerStyle={{flexDirection: 'row'}}
                  showsHorizontalScrollIndicator={false}>
                  {productContext?.homeItems?.map(store => (
                    <TouchableOpacity
                      key={store.id}
                      style={styles.gridItem}
                      onPress={() =>
                        props.navigation.navigate('Products', {
                          categoryId: store?.id,
                        })
                      }>
                      <Image
                        source={{uri: store?.imageURL}}
                        style={styles.gridImage}
                      />
                      <View>
                        <Text style={styles.gridText}>
                          {store?.categoryName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: themeConfig.appPrimary,
    paddingHorizontal: 16,
  },
  horizontalScroll: {marginVertical: 4, marginBottom: 16},
  recentItem: {marginLeft: 16, alignItems: 'center'},
  recentImage: {width: 80, height: 80, borderRadius: 40},
  recentText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: themeConfig.appPrimary,
    // width: 100,
  },
  roundedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  gridItem: {
    width: 120,
    marginLeft: 16,
    padding: 4,
    backgroundColor: themeConfig.appSecondary,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: themeConfig.appPrimary,
    shadowRadius: 10,
    marginVertical: 2,
  },
  gridImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridText: {
    fontSize: 12,
    // marginTop: 8,
    color: themeConfig.appPrimary,
    padding: 4,
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  loaderContainer: {
    position: 'absolute',
    // bottom: 400,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
export default HomeScreen;
