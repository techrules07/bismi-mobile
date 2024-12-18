import React, {useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {pContext} from '../context/ProductContext';
import {getAllProducts} from '../Networking/HomePageService';
import Heart from '../assets/Heart.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ProductList = () => {
  const productContext = useContext(pContext);
  const navigation = useNavigation();
  const route = useRoute();
  const {categoryId} = route.params;
  useEffect(() => {
    async function getProducts(params) {
      const productsListRespone = await getAllProducts(categoryId);
      console.log(productsListRespone.data);
      if (
        productsListRespone.status == 200 &&
        productsListRespone.data.code == 200
      ) {
        productContext.updateProductList(
          productsListRespone.data.data.listAllProductItems,
        );
      }
    }

    getProducts();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={() => navigation.navigate('home')}
          />
          <Text style={styles.headerTitle}>Product List</Text>
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
      <View style={{paddingLeft: 5, paddingRight: 5}}>
        {productContext.productList.length > 0 && (
          <FlatList
            data={productContext.productList}
            keyExtractor={item => item.id}
            numColumns={3}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 8,
                  }}>
                  <Image source={{uri: item.mainImage}} style={{height: 180}} />
                  <Text
                    style={{fontWeight: 700, marginTop: 8, color: '#000000'}}
                    numberOfLines={1}>
                    {item.product}
                  </Text>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                      <Text style={{fontSize: 10, fontWeight: 600}}>
                        Casual Shirts
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            fontWeight: 600,
                            fontSize: 12,
                            color: '#000000',
                          }}>
                          &#8377;{item.priceWithGst}
                        </Text>
                        <Text
                          style={{
                            fontSize: 8,
                            fontWeight: 500,
                            color: '#4E4E4E',
                            marginLeft: 8,
                            textDecorationLine: 'line-through',
                          }}>
                          &#8377;1200
                        </Text>
                        <Text
                          style={{
                            fontSize: 8,
                            fontWeight: 500,
                            color: '#CC2727',
                            marginLeft: 8,
                            textDecorationLine: 'line-through',
                          }}>
                          20% OFF
                        </Text>
                      </View>
                    </View>
                    <Image source={Heart} style={{width: 50, height: 50}} />
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </ScrollView>
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
});
export default ProductList;
