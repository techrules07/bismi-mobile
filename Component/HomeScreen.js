import React, {useEffect, useContext} from 'react';
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
} from 'react-native';
import Logo from '../assets/logo-bismi.png';
import Search from '../assets/search.png';
import {getAllOffers, getAllCategories} from '../Networking/HomePageService';
import {pContext} from '../Context/ProductContext';
import Carousel from 'react-native-reanimated-carousel';
import SuccessScreen from './SuccessScreen';

const HomeScreen = props => {
  const productContext = useContext(pContext);
  console.log('pry', productContext);
  const width = Dimensions.get('window').width;

  useEffect(() => {
    async function fetchAllOffers() {
      const response = await getAllOffers();
      if (response.status == 200 && response.data.code == 200) {
        productContext.updateSliderItems(response.data.data);
      }
    }

    async function getAllCategoriesApi() {
      const categoriesResponse = await getAllCategories();
      if (
        categoriesResponse.status == 200 &&
        categoriesResponse.data.code == 200
      ) {
        productContext.updateCategories(categoriesResponse.data.data);
      }
    }
    async function getAllHomeApi() {
      const homeResponse = await getAllCategories();
      if (homeResponse.status == 200 && homeResponse.data.code == 200) {
        productContext.updateHomeItems(homeResponse.data.data);
      }
    }
    fetchAllOffers();
    getAllCategoriesApi();
    getAllHomeApi();
  }, []);

  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: '#703F07',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 18,
            paddingBottom: 18,
            width: '100%',
          }}>
          <Image source={Logo} style={{width: 64, height: 42}} />

          <View
            style={{
              backgroundColor: '#D9D9D9',
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 20,
              borderRadius: 7,
              width: '85%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            <Image source={Search} style={{width: 15, height: 15}} />
            <TextInput
              placeholder="search product"
              style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 10}}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#EDE0D4',
            width: '100%',
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            marginTop: 12,
            padding: 15,
            height: 800,
          }}>
          <View style={{height: 160, width: '100%'}}>
            {productContext.sliderItems.length > 0 && (
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

          <View style={{display: 'flex', flexDirection: 'column'}}>
            <View style={{display: 'flex', flexDirection: 'column'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  flexWrap: 'wrap',
                  flex: 1,
                  paddingTop: 16,
                  paddingBottom: 16,
                }}>
                {productContext.categories.map(item => {
                  return (
                    <TouchableOpacity
                      style={{
                        flexGrow: 0,
                        flexShrink: 0,
                        flexBasis: '25%',
                        flexDirection: 'column',
                        height: 110,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: 25,
                      }}
                      onPress={() => {
                        props.navigation.navigate('Products', {
                          categoryId: item.id,
                        });
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={{uri: item.imageURL}}
                          style={{width: 56, height: 56, borderRadius: 500}}
                        />
                        <Text
                          style={{
                            fontWeight: 500,
                            fontSize: 12,
                            color: '#703F07',
                            marginTop: 16,
                          }}>
                          {item.categoryName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 180,
              padding: 20,
            }}>
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
          <View style={{paddingLeft: 20}}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <ScrollView
              style={styles.horizontalScroll}
              horizontal={true}
              contentContainerStyle={{flexDirection: 'row'}}
              showsHorizontalScrollIndicator={false}>
              {productContext?.homeItems?.map(store => (
                <View key={store.id} style={styles.gridItem}>
                  <Image
                    source={{uri: store?.imageURL}}
                    style={styles.gridImage}
                  />
                  <View style={styles.gridText}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>
                      {store?.categoryName}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#703F07',
  },
  horizontalScroll: {marginVertical: 10},
  recentItem: {marginRight: 10, alignItems: 'center'},
  recentImage: {width: 80, height: 80, borderRadius: 8},
  recentText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
    width: 100,
  },
  roundedImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  gridItem: {
    width: 120,
    marginRight: 20,
    backgroundColor: '#EDE0D4',
    borderRadius: 8,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  gridText: {
    fontSize: 12,
    marginTop: 8,
    padding: 5,
    textAlign: 'center',
  },
});
export default HomeScreen;
