import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {pContext} from '../Context/ProductContext';
import {getAllProducts} from '../Networking/HomePageService';
import Heart from '../assets/Heart.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserContext} from '../Context/UserContext';
import FilterPage from './ProductList/Filter';
const ProductList = () => {
  const productContext = useContext(pContext);
  const userContext = useContext(UserContext);
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  let [sortedData, setSortedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterProductRange, setFilterProductRange] = useState(null);
  let userInfo = userContext?.user;
  const navigation = useNavigation();
  const route = useRoute();
  const {categoryId} = route?.params;
  const fetchProducts = async categoryId => {
    const productsListResponse = await getAllProducts(categoryId, userInfo?.id);
    if (
      productsListResponse?.status === 200 &&
      productsListResponse?.data?.code === 200
    ) {
      productContext?.updateProductList(
        productsListResponse?.data?.data?.listAllProductItems,
      );
    }
  };
  const groupProducts = products => {
    const grouped = [];
    for (let i = 0; i < products.length; i += 2) {
      grouped.push(products.slice(i, i + 2));
    }
    return grouped;
  };

  const productsToRenders = filterProductRange
    ? filteredData
    : productContext?.productList;
  const groupedProducts = groupProducts(productsToRenders || []);
  useEffect(() => {
    if (categoryId) {
      productContext?.updateProductList([]);
      fetchProducts(categoryId);
    }
  }, [categoryId]);
  const handleSortOptionSelect = option => {
    setSelectedSort(option);
    setSortVisible(false);
    let sorted_data = [];
    if (option === 'Low Price') {
      sorted_data = productContext?.productList?.sort(
        (a, b) => a.unitPrice - b.unitPrice,
      );
    } else if (option === 'High Price') {
      sorted_data = productContext?.productList?.sort(
        (a, b) => b.unitPrice - a.unitPrice,
      );
    } else if (option === 'Popularity') {
      sorted_data = productContext?.productList?.sort(
        (a, b) => b.rating - a.rating,
      );
    }
    setSortedData(sorted_data);
  };
  const handleFilterApply = filtered_data => {
    setFilteredData(filtered_data);
    setFilterVisible(false);
  };
  const renderSortModal = () => (
    <Modal
      transparent
      animationType="slide"
      visible={sortVisible}
      onRequestClose={() => setSortVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.sortContainer}>
          <Text style={styles.sortTitle}>Sort By</Text>

          {['Low Price', 'High Price', 'Popularity']?.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.sortOption}
              onPress={() => setSelectedSort(option)}>
              <Text style={styles.sortText}>{option}</Text>
              <Icon
                name={
                  selectedSort === option ? 'radiobox-marked' : 'radiobox-blank'
                }
                size={24}
                color="#703F07"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              handleSortOptionSelect(selectedSort);
              setSortVisible(false);
            }}>
            <Text style={styles.applyButtonText}>Apply Sort</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  let productsToRender = selectedSort
    ? sortedData
    : productContext?.productList;
  let filtered_products = filterProductRange ? filteredData : productsToRender;
  const renderFilterModal = () => (
    <Modal
      transparent
      animationType="slide"
      visible={filterVisible}
      onRequestClose={() => setFilterVisible(false)}>
      <FilterPage
        filterProductRange={filterProductRange}
        setFilterProductRange={setFilterProductRange}
        applyFilter={handleFilterApply}
        productsData={productsToRender}
        setFilterVisible={setFilterVisible}
        navigation={navigation}
      />
    </Modal>
  );
  return (
    <View style={{flex: 1}}>
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
            {/* <Icon name="magnify" size={24} color="#fff" /> */}
            <Icon
              name="cart"
              size={24}
              color="#fff"
              onPress={() => navigation.navigate('Cart')}
            />
          </View>
        </View>
        <View style={{paddingLeft: 5, paddingRight: 5}}>
          {filtered_products?.length > 0 ? (
            <FlatList
              data={groupedProducts}
              keyExtractor={(item, index) => `row-${index}`}
              renderItem={({item}) => (
                <View style={styles.row}>
                  {item.map(product => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.card}
                      onPress={() =>
                        navigation.navigate('ProductListView', {
                          selectedItem: product,
                          similarItem: productContext?.productList?.filter(
                            otherItem => otherItem?.id !== product?.id,
                          ),
                        })
                      }>
                      <Image
                        source={{uri: product?.mainImage}}
                        style={styles.image}
                      />
                      <Text style={styles.productName} numberOfLines={1}>
                        {product.product}
                      </Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                          &#8377;{product?.priceWithGst}
                        </Text>
                        <Text style={styles.discount}>20% OFF</Text>
                      </View>
                      {/* <Image source={Heart} style={styles.heartIcon} /> */}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              contentContainerStyle={styles.listContainer}
            />
          ) : filterProductRange ? (
            <View style={{flex: 1, margin: 12}}>
              <Text
                style={{
                  padding: 12,
                  textAlign: 'center',
                  borderWidth: 1,
                  borderStyle: 'dashed',
                }}>
                No products available for this applied filter
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={() => {
            setFilterVisible(true);
          }}>
          <Icon name="filter-outline" size={28} color="#fff" />
          <Text style={styles.footerText}>Filter</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={() => setSortVisible(true)}>
          <Icon name="filter-variant" size={28} color="#fff" />
          <Text style={styles.footerText}>Sort</Text>
        </TouchableOpacity>
      </View>
      {renderSortModal()}
      {renderFilterModal()}
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
  listContainer: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    maxWidth: '48%',
    overflow: 'hidden',
    marginVertical: 2,
  },
  image: {
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  productName: {
    fontWeight: '700',
    marginTop: 8,
    color: '#000000',
    fontSize: 14,
    paddingLeft:4
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  price: {
    fontWeight: '600',
    fontSize: 12,
    color: '#000000',
  },
  discount: {
    fontSize: 10,
    fontWeight: '500',
    color: '#CC2727',
    textDecorationLine: 'line-through',
  },
  heartIcon: {
    width: 20,
    height: 20,
    marginTop: 10,
    alignSelf: 'flex-end',
    marginRight: 10,
  },


  headerIcons: {flexDirection: 'row', gap: 15},
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  footer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: '#703F07',
    padding: 10,
  },
  footerText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    width: 2,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sortContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sortTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#703F07',
    marginBottom: 20,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sortText: {
    fontSize: 18,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#703F07',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default ProductList;
